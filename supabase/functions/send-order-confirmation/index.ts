import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";
/// <reference lib="deno.window" />

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  product_image?: string;
}

interface OrderConfirmationRequest {
  orderId: string;
  email: string;
  orderItems: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("[SEND-ORDER-CONFIRMATION] Function started");

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      orderId,
      email,
      orderItems,
      subtotal,
      tax,
      shipping,
      total,
    }: OrderConfirmationRequest = await req.json();

    console.log("[SEND-ORDER-CONFIRMATION] Processing order:", orderId);
    console.log("[SEND-ORDER-CONFIRMATION] Sending to:", email);

    // Generate order items HTML
    const itemsHtml = orderItems
      .map(
        (item) => `
        <tr>
          <td style="padding: 16px; border-bottom: 1px solid #eee;">
            <div style="display: flex; align-items: center; gap: 12px;">
              ${
                item.product_image
                  ? `<img src="${item.product_image}" alt="${item.product_name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" />`
                  : ""
              }
              <div>
                <p style="margin: 0; font-weight: 600; color: #333;">${item.product_name}</p>
                ${item.size ? `<p style="margin: 4px 0 0; font-size: 14px; color: #666;">Size: ${item.size}</p>` : ""}
                ${item.color ? `<p style="margin: 4px 0 0; font-size: 14px; color: #666;">Color: ${item.color}</p>` : ""}
              </div>
            </div>
          </td>
          <td style="padding: 16px; border-bottom: 1px solid #eee; text-align: center; color: #666;">
            ${item.quantity}
          </td>
          <td style="padding: 16px; border-bottom: 1px solid #eee; text-align: right; font-weight: 600; color: #333;">
            ₹${(item.price * item.quantity).toFixed(2)}
          </td>
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
          <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #000 0%, #333 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #fff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                SoleDrip
              </h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">
                Premium Footwear
              </p>
            </div>

            <!-- Confirmation Message -->
            <div style="padding: 40px 30px; text-align: center; border-bottom: 1px solid #eee;">
              <div style="width: 60px; height: 60px; background: #22c55e; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <span style="color: #fff; font-size: 30px;">✓</span>
              </div>
              <h2 style="margin: 0 0 10px; color: #333; font-size: 24px;">Order Confirmed!</h2>
              <p style="margin: 0; color: #666; font-size: 16px;">
                Thank you for your purchase. Your order has been received.
              </p>
              <p style="margin: 20px 0 0; padding: 12px 24px; background: #f5f5f5; border-radius: 8px; display: inline-block;">
                <span style="color: #666; font-size: 14px;">Order ID:</span><br/>
                <span style="color: #333; font-size: 16px; font-weight: 600;">${orderId.slice(0, 8).toUpperCase()}</span>
              </p>
            </div>

            <!-- Order Items -->
            <div style="padding: 30px;">
              <h3 style="margin: 0 0 20px; color: #333; font-size: 18px;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f5f5f5;">
                    <th style="padding: 12px 16px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #666;">Product</th>
                    <th style="padding: 12px 16px; text-align: center; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #666;">Qty</th>
                    <th style="padding: 12px 16px; text-align: right; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #666;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Totals -->
              <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #666;">Subtotal</span>
                  <span style="color: #333;">₹${subtotal.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #666;">Shipping</span>
                  <span style="color: #333;">${shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                  <span style="color: #666;">Tax</span>
                  <span style="color: #333;">₹${tax.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding-top: 16px; border-top: 2px solid #333;">
                  <span style="font-size: 18px; font-weight: 700; color: #333;">Total</span>
                  <span style="font-size: 18px; font-weight: 700; color: #333;">₹${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #f5f5f5; padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px; color: #666; font-size: 14px;">
                Questions about your order?
              </p>
              <a href="mailto:support@soledrip.com" style="color: #333; font-weight: 600; text-decoration: none;">
                support@soledrip.com
              </a>
              <p style="margin: 20px 0 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} SoleDrip. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: "SoleDrip <onboarding@resend.dev>",
      to: [email],
      subject: `Order Confirmed - #${orderId.slice(0, 8).toUpperCase()}`,
      html,
    });

    if (error) {
      console.error("[SEND-ORDER-CONFIRMATION] Resend error:", error);
      throw error;
    }

    console.log("[SEND-ORDER-CONFIRMATION] Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("[SEND-ORDER-CONFIRMATION] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
