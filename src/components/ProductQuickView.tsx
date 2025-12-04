import { ShoppingBag, Heart, Star, X, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

interface ProductQuickViewProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductQuickView = ({ product, open, onOpenChange }: ProductQuickViewProps) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-card border-border">
        <DialogTitle className="sr-only">{product.name} - Quick View</DialogTitle>
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative aspect-square bg-secondary">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.badge && (
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  {product.badge}
                </span>
              )}
              {discount > 0 && (
                <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-semibold rounded-full">
                  -{discount}%
                </span>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 md:p-8 flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {product.category}
            </span>
            
            <h2 className="font-display font-bold text-2xl md:text-3xl mt-2 text-foreground">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(product.rating)
                        ? "fill-primary text-primary"
                        : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-3xl font-bold text-foreground">
                ${product.price}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground mt-4 leading-relaxed">
              Experience premium quality with this exceptional product. Crafted with attention to detail and designed for those who appreciate the finer things in life.
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mt-6">
              <span className="text-sm font-medium text-foreground">Quantity:</span>
              <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto pt-6">
              <Button
                variant="gold"
                className="flex-1"
                size="lg"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={cn(
                  "px-4",
                  isLiked && "text-destructive border-destructive"
                )}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
              </Button>
            </div>

            {/* Extra Info */}
            <div className="flex flex-col gap-2 mt-6 pt-6 border-t border-border text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="text-foreground font-medium">Availability:</span>
                <span className="text-green-500">In Stock</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-foreground font-medium">SKU:</span>
                <span>PRD-{product.id.toString().padStart(4, '0')}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;
