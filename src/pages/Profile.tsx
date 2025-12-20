import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Phone, Camera, Loader2, LogOut, Package, Heart, Settings, Trash2, ChevronRight, Shield, Bell, Key } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useWishlist } from "@/hooks/useWishlist";
import { useUserOrders } from "@/hooks/useUserOrders";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
  paid: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
  shipped: "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30",
  delivered: "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30",
};

export default function ProfilePage() {
  const { user, profile, signOut, updateProfile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast: toastHook } = useToast();
  const { wishlistItems, isLoading: wishlistLoading, removeFromWishlist } = useWishlist();
  const { data: orders, isLoading: ordersLoading } = useUserOrders();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone: profile?.phone || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    const { error } = await updateProfile(formData);
    
    if (error) {
      toastHook({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toastHook({
        title: "Profile updated",
        description: "Your changes have been saved.",
      });
      setIsEditing(false);
    }
    setIsLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toastHook({
      title: "Signed out",
      description: "You've been successfully signed out.",
    });
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist.mutateAsync(productId);
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user?.email?.[0].toUpperCase() || "U";

  return (
    <Layout>
      {/* Header Section */}
      <section className="relative overflow-hidden border-b border-border bg-muted/30 py-10 lg:py-14">
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-50" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-background shadow-xl">
                  <AvatarImage src={profile?.avatar_url || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-3xl font-display text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-card border border-border shadow-md hover:bg-muted transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="font-display text-3xl lg:text-4xl">
                  {profile?.full_name || "User"}
                </h1>
                <p className="mt-1 text-muted-foreground">{user?.email}</p>
                {isAdmin && (
                  <Badge className="mt-2 bg-primary/10 text-primary border-primary/20 font-semibold">
                    <Shield className="mr-1 h-3 w-3" />
                    Admin
                  </Badge>
                )}
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="rounded-xl border-2 font-semibold hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-10 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-4xl"
        >
          {/* Content */}
          <Tabs defaultValue="profile" className="mt-0">
            <TabsList className="grid w-full grid-cols-4 h-14 rounded-2xl bg-muted/50 p-1.5">
              <TabsTrigger value="profile" className="rounded-xl data-[state=active]:shadow-md font-semibold">
                <User className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-xl data-[state=active]:shadow-md font-semibold">
                <Package className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="rounded-xl data-[state=active]:shadow-md font-semibold">
                <Heart className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Wishlist</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-xl data-[state=active]:shadow-md font-semibold">
                <Settings className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-border bg-card p-8 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl">Personal Information</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Manage your profile details</p>
                  </div>
                  {!isEditing ? (
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(true)}
                      className="rounded-xl font-semibold"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => setIsEditing(false)} className="rounded-xl">
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={isLoading} className="rounded-xl font-semibold">
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="full_name" className="text-sm font-semibold">Full Name</Label>
                    <div className="relative mt-2">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="full_name"
                        name="full_name"
                        value={isEditing ? formData.full_name : profile?.full_name || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="pl-11 h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary/50 focus:bg-background transition-all"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        value={user?.email || ""}
                        disabled
                        className="pl-11 h-12 rounded-xl bg-muted/50 border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-semibold">Phone Number</Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        value={isEditing ? formData.phone : profile?.phone || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="pl-11 h-12 rounded-xl bg-muted/50 border-transparent focus:border-primary/50 focus:bg-background transition-all"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="orders" className="mt-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-border bg-card p-8 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl">Order History</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Track and manage your orders</p>
                  </div>
                  {orders && orders.length > 0 && (
                    <Badge variant="secondary" className="rounded-lg font-semibold">
                      {orders.length} order{orders.length !== 1 && "s"}
                    </Badge>
                  )}
                </div>

                {ordersLoading ? (
                  <div className="mt-8 space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-28 rounded-2xl" />
                    ))}
                  </div>
                ) : orders && orders.length > 0 ? (
                  <div className="mt-8 space-y-4">
                    {orders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="rounded-2xl border border-border overflow-hidden bg-muted/30"
                      >
                        {/* Order Header */}
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-card border border-border shadow-sm">
                              <Package className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(order.created_at), "MMMM d, yyyy")} • {order.order_items?.length || 0} item{(order.order_items?.length || 0) !== 1 && "s"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className={`${statusColors[order.status] || ""} rounded-lg font-semibold`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                            <span className="text-lg font-bold">₹{Number(order.total).toFixed(2)}</span>
                            <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${expandedOrder === order.id ? "rotate-90" : ""}`} />
                          </div>
                        </button>

                        {/* Order Details (Expandable) */}
                        {expandedOrder === order.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="border-t border-border bg-card p-5"
                          >
                            {/* Status Timeline */}
                            <div className="mb-6 flex items-center gap-2 text-sm overflow-x-auto pb-2">
                              <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${order.status === "pending" ? "bg-yellow-500" : "bg-green-500"}`} />
                              <span className="text-muted-foreground whitespace-nowrap">Placed</span>
                              {(order.status === "paid" || order.status === "shipped" || order.status === "delivered") && (
                                <>
                                  <span className="h-px flex-1 min-w-4 bg-border" />
                                  <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${order.status === "paid" ? "bg-blue-500" : "bg-green-500"}`} />
                                  <span className="text-muted-foreground whitespace-nowrap">Paid</span>
                                </>
                              )}
                              {(order.status === "shipped" || order.status === "delivered") && (
                                <>
                                  <span className="h-px flex-1 min-w-4 bg-border" />
                                  <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${order.status === "shipped" ? "bg-purple-500" : "bg-green-500"}`} />
                                  <span className="text-muted-foreground whitespace-nowrap">Shipped</span>
                                </>
                              )}
                              {order.status === "delivered" && (
                                <>
                                  <span className="h-px flex-1 min-w-4 bg-border" />
                                  <span className="h-2.5 w-2.5 rounded-full shrink-0 bg-green-500" />
                                  <span className="text-muted-foreground whitespace-nowrap">Delivered</span>
                                </>
                              )}
                            </div>

                            {/* Order Items */}
                            <div className="space-y-3">
                              {order.order_items?.map((item: any) => (
                                <div key={item.id} className="flex items-center gap-4 rounded-xl bg-muted/50 p-3">
                                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                                    {item.product_image ? (
                                      <img
                                        src={item.product_image}
                                        alt={item.product_name}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-full items-center justify-center">
                                        <span className="text-2xl">👟</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate">{item.product_name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {item.size && `Size: ${item.size}`}
                                      {item.color && ` • Color: ${item.color}`}
                                      {` • Qty: ${item.quantity}`}
                                    </p>
                                  </div>
                                  <p className="font-bold">₹{Number(item.price).toFixed(2)}</p>
                                </div>
                              ))}
                            </div>

                            {/* Order Summary */}
                            <div className="mt-5 rounded-xl bg-muted/50 p-4 space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>₹{Number(order.subtotal).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Tax</span>
                                <span>₹{Number(order.tax).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Shipping</span>
                                <span>₹{Number(order.shipping).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between font-bold pt-2 border-t border-border text-base">
                                <span>Total</span>
                                <span>₹{Number(order.total).toFixed(2)}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-8 flex flex-col items-center justify-center py-16 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
                      <Package className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-6 font-display text-xl">No orders yet</h3>
                    <p className="mt-2 text-muted-foreground">
                      Your order history will appear here
                    </p>
                    <Button className="mt-6 rounded-xl font-semibold" onClick={() => navigate("/shop")}>
                      Start Shopping
                    </Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="wishlist" className="mt-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-border bg-card p-8 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl">Your Wishlist</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Items you've saved for later</p>
                  </div>
                  {wishlistItems.length > 0 && (
                    <Badge variant="secondary" className="rounded-lg font-semibold">
                      {wishlistItems.length} item{wishlistItems.length !== 1 && "s"}
                    </Badge>
                  )}
                </div>
                
                {wishlistLoading ? (
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-36 rounded-2xl" />
                    ))}
                  </div>
                ) : wishlistItems.length > 0 ? (
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {wishlistItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group flex gap-4 rounded-2xl border border-border bg-muted/30 p-4 transition-all hover:bg-muted/50 hover:shadow-md"
                      >
                        <div
                          className="relative h-28 w-28 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-muted"
                          onClick={() => navigate(`/product/${item.product?.slug}`)}
                        >
                          {item.product?.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product?.name}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <span className="text-4xl opacity-30">👟</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            {item.product?.brand && (
                              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {item.product.brand.name}
                              </p>
                            )}
                            <h3
                              className="mt-1 cursor-pointer font-semibold leading-tight hover:text-primary transition-colors"
                              onClick={() => navigate(`/product/${item.product?.slug}`)}
                            >
                              {item.product?.name}
                            </h3>
                            <p className="mt-2 text-lg font-bold">
                              ₹{item.product?.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => navigate(`/product/${item.product?.slug}`)}
                              className="rounded-lg font-semibold"
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveFromWishlist(item.product_id)}
                              disabled={removeFromWishlist.isPending}
                              className="rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-8 flex flex-col items-center justify-center py-16 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
                      <Heart className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-6 font-display text-xl">Your wishlist is empty</h3>
                    <p className="mt-2 text-muted-foreground">
                      Save items you love for later
                    </p>
                    <Button className="mt-6 rounded-xl font-semibold" onClick={() => navigate("/shop")}>
                      Browse Products
                    </Button>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="settings" className="mt-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-border bg-card p-8 shadow-lg"
              >
                <div>
                  <h2 className="font-display text-2xl">Account Settings</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Manage your account preferences</p>
                </div>
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 p-5 transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card border border-border">
                        <Key className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Change Password</h3>
                        <p className="text-sm text-muted-foreground">
                          Update your account password
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="rounded-xl font-semibold">Change</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 p-5 transition-colors hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-card border border-border">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Manage your email preferences
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="rounded-xl font-semibold">Manage</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 border border-destructive/20">
                        <Trash2 className="h-5 w-5 text-destructive" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-destructive">Delete Account</h3>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and data
                        </p>
                      </div>
                    </div>
                    <Button variant="destructive" className="rounded-xl font-semibold">Delete</Button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </Layout>
  );
}