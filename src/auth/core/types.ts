export interface Plan {
  _id: string;
  name: string;
  price: number;
  billing_cycle?: string; // Optionnel
  features: string[];
  product_id: string;
  product_name?: string; // Optionnel
  createdAt: string;
  updatedAt: string;
  __v: number;
}