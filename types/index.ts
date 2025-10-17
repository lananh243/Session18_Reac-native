export interface Product {
  id: string;
  productName: string;
  price: number;
  images: {
    id: string;
    url: string;
    publicid: string;
  }[];
}

export type ProductCardProps = {
  item: Product;
};


export type CartItemType = {
  id: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
};

export type CartItemProps = {
  item: CartItemType;
  onRemove: () => void; 
};