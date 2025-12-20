import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  variant?: "icon" | "default";
  className?: string;
}

export function WishlistButton({ productId, variant = "icon", className }: WishlistButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const inWishlist = isInWishlist(productId);
  const isPending = addToWishlist.isPending || removeFromWishlist.isPending;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please sign in to save items to your wishlist");
      navigate("/auth");
      return;
    }

    try {
      await toggleWishlist(productId);
      toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (variant === "icon") {
    return (
      <Button
        size="icon"
        variant="secondary"
        className={cn(
          "h-9 w-9 transition-all",
          inWishlist && "bg-primary/10 text-primary hover:bg-primary/20",
          className
        )}
        onClick={handleClick}
        disabled={isPending}
      >
        <Heart className={cn("h-4 w-4", inWishlist && "fill-primary")} />
      </Button>
    );
  }

  return (
    <Button
      variant={inWishlist ? "secondary" : "outline"}
      className={cn(inWishlist && "bg-primary/10 text-primary hover:bg-primary/20", className)}
      onClick={handleClick}
      disabled={isPending}
    >
      <Heart className={cn("mr-2 h-4 w-4", inWishlist && "fill-primary")} />
      {inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
    </Button>
  );
}
