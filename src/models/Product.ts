export interface ProductModel {
    category:     string;
    descriptions: string;
    id:           number;
    image_url:    string | null;
    is_warranty:  boolean;
    name:         string;
    price:        number;
    stock:        number;
    user_id:      number;
}