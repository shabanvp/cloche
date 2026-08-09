export interface Boutique {
  id: string | number;
  boutique_name: string;
  owner_name?: string;
  email?: string;
  phone?: string;
  city?: string;
  district?: string;
  area?: string;
  plan?: string;
  is_featured?: boolean;
  priority_score?: number;
  tags?: string;
  shop_location?: string;
  image_url?: string;
  logo_url?: string;
  logo?: string;
  profile_logo?: string;
  cover_url?: string;
  coverImage?: string;
  rating?: number;
  description?: string;
  category?: string;
  starting_price?: string;
  startingPrice?: string;
  verified?: boolean;
}

export interface Product {
  id: string | number;
  boutique_id: string | number;
  product_name: string;
  category: string;
  price: number;
  description?: string;
  image_url?: string;
  tags?: string;
  fabric?: string;
  location?: string;
  district?: string;
  boutique_name?: string;
  boutique_city?: string;
}
