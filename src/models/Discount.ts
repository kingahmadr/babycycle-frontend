// export interface DiscountModel {
//     discounted_price:     number;
//     discount_amount:     null;
//     discount_percentage: string;
//     end_date:            string;
//     id:                  number;
//     is_active:           boolean;
//     product_id:          number;
//     start_date:          string;
// }

export interface DiscountModel {
    id: number;
    discount_id?: number; // Allow discount_id as a number
    discounted_price?: number;
    discount_amount?: number;
    discount_percentage?: number;
    is_active?: boolean;
    end_date?: string;
    start_date?: string;
    product_id?: number;
  }