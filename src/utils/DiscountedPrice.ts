// export const finalPrice = (price:number,discount:number | null): number=>{
//     return discount || discount!==null ? Number((price - (price * discount/100)).toFixed(2)):Number(price.toFixed(2))
// }

export const finalPrice = (price: number, discount: number | null): number => {
    const effectiveDiscount = discount ?? 0; // Set discount to 0 if it's null
    return Number((price - (price * effectiveDiscount / 100)).toFixed(2));
};
