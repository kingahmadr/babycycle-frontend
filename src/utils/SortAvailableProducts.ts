// utils/sortProducts.ts
import { ProductModel } from '@/models/Product';
import { DiscountModel } from '@/models/Discount';

// Function to sort products, including out-of-stock handling
export const sortProducts = (products: ProductModel[], sortBy: string, discounts: { [key: number]: DiscountModel | null }) => {
  return products
    .sort((a, b) => {
      // Sort out-of-stock products to the end
      if (a.stock === 0 && b.stock !== 0) return 1;
      if (a.stock !== 0 && b.stock === 0) return -1;

      // If both are in stock or both out of stock, apply the sorting logic
      switch (sortBy) {
        case 'highest_price':
          return b.price - a.price
        case 'lowest_price':
          return a.price - b.price
        case 'newest':
        return b.id - a.id
        case 'discount':
          return 0
        default:
          return 0
      }
    })
    .map((product) => ({
      ...product,
      discount: discounts[product.id] || null,
    }));
};
