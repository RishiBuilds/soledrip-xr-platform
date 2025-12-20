import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[VERIFY-ORDER] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = resendKey ? new Resend(resendKey) : null;

    const { sessionId } = await req.json();
    if (!sessionId) throw new Error("Missing session ID");

    logStep("Retrieving session", { sessionId });

    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "line_items.data.price.product"],
    });

    if (!session) throw new Error("Session not found");
    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    logStep("Session retrieved", { 
      paymentStatus: session.payment_status,
      email: session.customer_details?.email 
    });

    // Check if order already exists
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("stripe_session_id", sessionId)
      .single();

    if (existingOrder) {
      logStep("Order already exists", { orderId: existingOrder.id });
      return new Response(
        JSON.stringify({ orderId: existingOrder.id, alreadyProcessed: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate totals
    const subtotal = (session.amount_subtotal || 0) / 100;
    const shipping = (session.shipping_cost?.amount_total || 0) / 100;
    const tax = (session.total_details?.amount_tax || 0) / 100;
    const total = (session.amount_total || 0) / 100;

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        email: session.customer_details?.email || "",
        status: "paid",
        subtotal,
        shipping,
        tax,
        total,
        stripe_session_id: sessionId,
        stripe_payment_intent_id: session.payment_intent as string,
        shipping_address: session.shipping_details ? {
          name: session.shipping_details.name,
          address: session.shipping_details.address,
        } : null,
      })
      .select()
      .single();

    if (orderError) {
      logStep("Error creating order", { error: orderError.message });
      throw orderError;
    }

    logStep("Order created", { orderId: order.id });

    // Create order items
    const orderItems = session.line_items?.data.map((item: any) => {
      const product = item.price?.product as Stripe.Product;
      return {
        order_id: order.id,
        product_name: product?.name || item.description || "Product",
        quantity: item.quantity || 1,
        price: (item.amount_total || 0) / 100 / (item.quantity || 1),
        size: product?.metadata?.size || null,
        color: product?.metadata?.color || null,
        product_image: product?.images?.[0] || null,
        product_id: product?.metadata?.productId || null,
        variant_id: product?.metadata?.variantId || null,
      };
    }) || [];

    if (orderItems.length > 0) {
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        logStep("Error creating order items", { error: itemsError.message });
      }
    }

    logStep("Order items created", { count: orderItems.length });

    // Send confirmation email
    if (resend && session.customer_details?.email) {
      try {
        const itemsHtml = orderItems
          .map(
            (item: any) => `
            <tr>
              <td style="padding: 16px; border-bottom: 1px solid #eee;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  ${item.product_image ? `<img src="${item.product_image}" alt="${item.product_name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" />` : ""}
                  <div>
                    <p style="margin: 0; font-weight: 600; color: #333;">${item.product_name}</p>
                    ${item.size ? `<p style="margin: 4px 0 0; font-size: 14px; color: #666;">Size: ${item.size}</p>` : ""}
                    ${item.color ? `<p style="margin: 4px 0 0; font-size: 14px; color: #666;">Color: ${item.color}</p>` : ""}
                  </div>
                </div>
              </td>
              <td style="padding: 16px; border-bottom: 1px solid #eee; text-align: center; color: #666;">${item.quantity}</td>
              <td style="padding: 16px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600; color: #333;">₹${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `
          )
          .join("");

        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <div style="background: linear-gradient(135deg, #000 0%, #333 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; color: #fff; font-size: 28px; font-weight: 700;">SoleDrip</h1>
                  <p style="margin: 10px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Premium Footwear</p>
                </div>
                <div style="padding: 40px 30px; text-align: center; border-bottom: 1px solid #eee;">
                  <div style="width: 60px; height: 60px; background: #22c55e; border-radius: 50%; margin: 0 auto 20px; line-height: 60px;">
                    <span style="color: #fff; font-size: 30px;">✓</span>
                  </div>
                  <h2 style="margin: 0 0 10px; color: #333; font-size: 24px;">Order Confirmed!</h2>
                  <p style="margin: 0; color: #666;">Thank you for your purchase.</p>
                  <p style="margin: 20px 0 0; padding: 12px 24px; background: #f5f5f5; border-radius: 8px; display: inline-block;">
                    <span style="color: #666; font-size: 14px;">Order ID:</span><br/>
                    <span style="color: #333; font-size: 16px; font-weight: 600;">${order.id.slice(0, 8).toUpperCase()}</span>
                  </p>
                </div>
                <div style="padding: 30px;">
                  <h3 style="margin: 0 0 20px; color: #333; font-size: 18px;">Order Summary</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                      <tr style="background: #f5f5f5;">
                        <th style="padding: 12px 16px; text-align: left; font-size: 12px; text-transform: uppercase; color: #666;">Product</th>
                        <th style="padding: 12px 16px; text-align: center; font-size: 12px; text-transform: uppercase; color: #666;">Qty</th>
                        <th style="padding: 12px 16px; text-align: right; font-size: 12px; text-transform: uppercase; color: #666;">Price</th>
                      </tr>
                    </thead>
                    <tbody>${itemsHtml}</tbody>
                  </table>
                  <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span style="color: #666;">Subtotal</span><span style="color: #333;">₹${subtotal.toFixed(2)}</span></div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;"><span style="color: #666;">Shipping</span><span style="color: #333;">${shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span></div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 16px;"><span style="color: #666;">Tax</span><span style="color: #333;">₹${tax.toFixed(2)}</span></div>
                    <div style="display: flex; justify-content: space-between; padding-top: 16px; border-top: 2px solid #333;"><span style="font-size: 18px; font-weight: 700; color: #333;">Total</span><span style="font-size: 18px; font-weight: 700; color: #333;">₹${total.toFixed(2)}</span></div>
                  </div>
                </div>
                <div style="background: #f5f5f5; padding: 30px; text-align: center;">
                  <p style="margin: 0; color: #999; font-size: 12px;">© ${new Date().getFullYear()} SoleDrip. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `;

        await resend.emails.send({
          from: "SoleDrip <onboarding@resend.dev>",
          to: [session.customer_details.email],
          subject: `Order Confirmed - #${order.id.slice(0, 8).toUpperCase()}`,
          html,
        });

        logStep("Email sent successfully");
      } catch (emailError: any) {
        logStep("Email error (non-fatal)", { error: emailError.message });
      }
    }

    return new Response(
      JSON.stringify({ orderId: order.id, success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    logStep("ERROR", { message: error.message });
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
