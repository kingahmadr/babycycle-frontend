export interface SellerProductModel {
    created_at: string; 
    discount_percentage: number; 
    end_date: string; 
    id: number; 
    image_url: string | null; 
    is_active: boolean; 
    is_warranty: boolean; 
    name: string; 
    price: number; 
    rating: number | null; 
    review: string | null; 
    seller_id: number; 
    start_date: string; 
    stock: number; 
  }