import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Navbar } from "@/components/navbar";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { ProductManagement } from "@/components/admin/product-management";
import { OrderManagement } from "@/components/admin/order-management";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  ArrowLeft 
} from "lucide-react";
import { Link } from "wouter";

export default function Admin() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    document.title = "ShopHub - Admin Dashboard";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Manage your e-commerce store with our comprehensive admin dashboard. Control products, orders, customers and more.');
    }
  }, []);

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      toast({
        title: "Unauthorized",
        description: "Admin access required. Redirecting...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
      return;
    }
  }, [user, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 bg-muted rounded-lg mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user?.isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gradient">Admin Dashboard</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome, {user.firstName}
            </p>
          </div>
          
          <nav className="px-4 space-y-2">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <BarChart3 className="h-4 w-4 mr-3" />
              Dashboard
            </Button>
            
            <Button
              variant={activeTab === "products" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("products")}
            >
              <Package className="h-4 w-4 mr-3" />
              Products
            </Button>
            
            <Button
              variant={activeTab === "orders" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingCart className="h-4 w-4 mr-3" />
              Orders
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start"
              disabled
            >
              <Users className="h-4 w-4 mr-3" />
              Customers
              <span className="ml-auto text-xs text-muted-foreground">Soon</span>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start"
              disabled
            >
              <Settings className="h-4 w-4 mr-3" />
              Settings
              <span className="ml-auto text-xs text-muted-foreground">Soon</span>
            </Button>

            <div className="pt-4 border-t">
              <Link href="/">
                <Button variant="outline" className="w-full justify-start">
                  <ArrowLeft className="h-4 w-4 mr-3" />
                  Back to Store
                </Button>
              </Link>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="dashboard" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold">Dashboard Overview</h1>
                  <p className="text-muted-foreground">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                
                <DashboardStats />
                
                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        className="w-full justify-start" 
                        onClick={() => setActiveTab("products")}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Add New Product
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab("orders")}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        View Recent Orders
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span>New order #12345</span>
                          <span className="text-muted-foreground">2 min ago</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Product updated</span>
                          <span className="text-muted-foreground">1 hour ago</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>New customer registered</span>
                          <span className="text-muted-foreground">3 hours ago</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="products">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Product Management</h1>
                  </div>
                  <ProductManagement />
                </div>
              </TabsContent>

              <TabsContent value="orders">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">Order Management</h1>
                  </div>
                  <OrderManagement />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
