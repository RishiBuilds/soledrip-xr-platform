import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAnalytics } from "@/hooks/useAdminData";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const { data: analytics, isLoading } = useAdminAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  const stats = [
    {
      title: "Total Revenue",
      value: `$${analytics?.totalRevenue.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      description: "All time revenue",
    },
    {
      title: "Total Orders",
      value: analytics?.totalOrders || 0,
      icon: ShoppingCart,
      description: `${analytics?.paidOrders || 0} completed`,
    },
    {
      title: "Products",
      value: analytics?.productsCount || 0,
      icon: Package,
      description: "Active products",
    },
    {
      title: "Conversion Rate",
      value: analytics?.totalOrders
        ? `${((analytics.paidOrders / analytics.totalOrders) * 100).toFixed(1)}%`
        : "0%",
      icon: TrendingUp,
      description: "Orders completed",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Daily revenue for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {analytics?.revenueData && analytics.revenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => `$${Number(value).toFixed(2)}`}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No revenue data yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products by quantity sold</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics?.topProducts && analytics.topProducts.length > 0 ? (
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                      {product.product_image && (
                        <img
                          src={product.product_image}
                          alt={product.product_name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.quantity} sold • ₹{Number(product.price).toFixed(2)} each
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{(product.quantity * Number(product.price)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No sales data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
