import axios from 'axios';

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
}

const API = 'http://localhost:3000/products';

export const getProducts = () => axios.get<ProductListResponse>(API);


export const addProduct = (data: Omit<Product, 'id'>) =>
  axios.post<Product>(API, data);

export const updateProduct = (id: number, data: Product) =>
  axios.put<Product>(`${API}/${id}`, data);

export const deleteProduct = (id: number) =>
  axios.delete(`${API}/${id}`);
