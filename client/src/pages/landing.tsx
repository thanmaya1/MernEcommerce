import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ShoppingBag, Star, Truck, Shield, CreditCard, Headphones } from "lucide-react";

export default function Landing() {
  useEffect(() => {
    document.title = "ShopHub - Your Complete E-commerce Destination";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Discover millions of products from trusted sellers worldwide. Fast shipping, secure payments, and exceptional customer service at ShopHub.');
    }
  }, []);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const features = [
    {
      icon: ShoppingBag,
      title: "Millions of Products",
      description: "Browse through our vast collection of products from electronics to fashion",
    },
    {
      icon: Truck,
      title: "Fast Shipping",
      description: "Get your orders delivered quickly with our express shipping options",
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "Shop with confidence with our secure payment and buyer protection",
    },
    {
      icon: CreditCard,
      title: "Easy Payments",
      description: "Multiple payment options including cards, digital wallets, and more",
    },
    {
      icon: Star,
      title: "Quality Assured",
      description: "All products are verified for quality and authenticity",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Our customer service team is always here to help you",
    },
  ];

  const categories = [
    {
      name: "Electronics",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&w=300&h=200&fit=crop",
      count: "1,234+ products"
    },
    {
      name: "Fashion",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&w=300&h=200&fit=crop",
      count: "2,567+ products"
    },
    {
      name: "Home & Living",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&w=300&h=200&fit=crop",
      count: "891+ products"
    },
    {
      name: "Sports",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&w=300&h=200&fit=crop",
      count: "456+ products"
    },
  ];

  return (
    <ThemeProvider defaultTheme="light" storageKey="shophub-theme">
      <div className="min-h-screen bg-background">
        <Navbar showAuthButton />
        
        {/* Hero Section */}
        <section className="relative overflow-hidden gradient-primary">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-orange-600/90"></div>
          <div 
            className="relative min-h-[600px] flex items-center bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&w=1200&h=600&fit=crop')"
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Shop The Future
                </h1>
                <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
                  Discover amazing products with unbeatable prices and lightning-fast delivery
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    onClick={handleLogin}
                    className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
                  >
                    Start Shopping Now
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 text-lg"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose ShopHub?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Experience the best in online shopping with our commitment to quality, security, and customer satisfaction
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-card hover:shadow-card-hover transition-all-smooth">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold ml-4">{feature.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Shop by Category</h2>
              <p className="text-muted-foreground text-lg">
                Explore our wide range of product categories
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Card key={index} className="overflow-hidden shadow-card hover:shadow-card-hover transition-all-smooth cursor-pointer group">
                  <div className="relative">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 gradient-secondary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Shopping?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join millions of satisfied customers and discover your next favorite product today
            </p>
            <Button 
              size="lg" 
              onClick={handleLogin}
              className="bg-white text-secondary hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
            >
              Get Started Now
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-muted py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div>
                <h3 className="text-2xl font-bold text-gradient mb-4">ShopHub</h3>
                <p className="text-muted-foreground">
                  Your trusted online shopping destination with millions of products and exceptional service.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Categories</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">Electronics</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Fashion</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Home & Living</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Sports</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
              <p>&copy; 2024 ShopHub. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
