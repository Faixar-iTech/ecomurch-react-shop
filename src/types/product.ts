export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  badge?: string;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}
