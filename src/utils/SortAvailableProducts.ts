import { ProductModel } from '@/models/Product';

export const sortProducts = (products: ProductModel[], sortBy: string) => {
  return products
    .sort((a, b) => {
      switch (sortBy) {
        case 'highest_price':
          return b.price - a.price
        case 'lowest_price':
          return a.price - b.price
        case 'newest':
        return b.id - a.id
        default:
          return 0
      }
    })
    .map((product) => ({
      ...product
    }))
}
