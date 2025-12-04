// src/components/ProductGrid.jsx
import React, { useState, useEffect } from "react";
import { Star, ShoppingBag, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { productAPI } from "@/services/api";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import ImageDisplay from "./ui/image-display";

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getAllProducts({
        isFeatured: true,
        inStock: true,
        pageSize: 8,
      });
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      quantity: 1,
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="aspect-square" />
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  const fixImageUrl = (imagesArray) => {
    if (
      !imagesArray ||
      !Array.isArray(imagesArray) ||
      imagesArray.length === 0
    ) {
      return "";
    }

    // Check if the first element is a proper data URL
    if (imagesArray.length === 1) {
      const singleImage = imagesArray[0];
      if (
        singleImage.startsWith("data:image/") ||
        singleImage.startsWith("http")
      ) {
        return singleImage;
      }
      // If it's just base64, add prefix
      return `data:image/jpeg;base64,${singleImage}`;
    }

    // If array has multiple elements (like in your case: ["data:image/jpeg", "base64,..."])
    if (imagesArray.length >= 2) {
      // Check if first element is the mime type and second is base64
      if (
        imagesArray[0] === "data:image/jpeg" ||
        imagesArray[0] === "data:image/png"
      ) {
        const mimeType = imagesArray[0];
        const base64Data = imagesArray[1];

        // Remove "base64," prefix if present
        if (base64Data.startsWith("base64,")) {
          return `${mimeType};${base64Data}`;
        } else {
          return `${mimeType};base64,${base64Data}`;
        }
      }
    }

    // Try to find any element that looks like base64
    for (const img of imagesArray) {
      if (img && img.length > 100) {
        // Check if it looks like base64
        if (
          img.startsWith("/9j/") || // JPEG base64 marker
          img.startsWith("iVBOR") || // PNG base64 marker
          img.startsWith("base64,")
        ) {
          return `data:image/jpeg;base64,${
            img.startsWith("base64,") ? img.substring(7) : img
          }`;
        }
      }
    }

    return "";
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
          Featured Products
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our handpicked collection of premium products
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/20"
          >
            <div className="relative aspect-square overflow-hidden">
              {product.images && product.images.length > 0 ? (
                // <img
                //   src={fixImageUrl(product.images)}
                //   alt={product.name}
                //   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                // />
                <ImageDisplay
                  images={product.images}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  fallbackClassName="aspect-square"
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                </div>
              )}

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-3 left-3">
                  <Badge variant="gold" className="font-medium">
                    {product.badge}
                  </Badge>
                </div>
              )}

              {/* Sale Badge */}
              {product.isOnSale && (
                <div className="absolute top-3 right-3">
                  <Badge variant="destructive" className="font-medium">
                    -{product.discountPercentage?.toFixed(0)}%
                  </Badge>
                </div>
              )}

              {/* Quick Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Link to={`/products/${product.id}`}>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full"
                  >
                    <Eye className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="mb-3">
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                  {product.description}
                </p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.isOnSale && (
                      <span className="text-sm line-through text-muted-foreground">
                        ${product.originalPrice?.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {product.isOnSale && (
                    <span className="text-sm font-medium text-destructive">
                      Save ${product.youSave?.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link to={`/products/${product.id}`}>View Details</Link>
                </Button>
                <Button
                  variant="gold"
                  className="flex-1"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No products available</h3>
          <p className="text-muted-foreground">
            Check back soon for new products
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
