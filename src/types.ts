export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  priceRange: string;
  address: string;
  isVeg?: boolean;
  description: string;
  distance: number;
  tags: string[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  restaurantId: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface User {
  name: string;
  email: string;
}