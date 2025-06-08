import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { WishlistItemWithProduct } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ProductCard } from "@/components/product-card";

export default function Favorites() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wishlist, isLoading } = useQuery<WishlistItemWithProduct[]>({
    queryKey: ['/api/wishlist'],
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/wishlist/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wishlist'] });
      toast({
        title: "Removed from favorites",
        description: "Item has been removed from your favorites.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item from favorites.",
        variant: "destructive",
      });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: (productId: number) =>
      apiRequest('POST', '/api/cart', { productId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      toast({
        title: "Added to cart",
        description: "Item has been added to your cart.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Favorites</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Your saved items and wishlist
          </p>
        </div>

        {!wishlist || wishlist.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Heart className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No favorites yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                Save items you love to your favorites list. Click the heart icon on any product to add it here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="relative">
                <ProductCard product={{...item.product, category: null, reviews: []}} />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 hover:bg-white"
                    onClick={() => addToCartMutation.mutate(item.product.id)}
                    disabled={addToCartMutation.isPending}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                    onClick={() => removeFromWishlistMutation.mutate(item.id)}
                    disabled={removeFromWishlistMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}