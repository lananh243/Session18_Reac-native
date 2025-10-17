// src/apis/cart.api.ts
import axiosInstance from "@/utils/axiosInstance";

// 🛒 Lấy giỏ hàng
export const getCart = async () => {
  const res = await axiosInstance.get("/carts");
  return res.data;
};

// ➕ Thêm sản phẩm vào giỏ
export const addToCartApi = async (productId: string, quantity = 1) => {
  const res = await axiosInstance.post("/carts/add", { productId, quantity });
  return res.data;
};

// Cập nhật số lượng trong giỏ
export const updateCartItem = async (cartItemId: string | number, quantity: number) => {
  const response = await axiosInstance.put(`/carts/items/${cartItemId}`, { quantity });
  return response.data;
};

// ❌ Xóa 1 sản phẩm khỏi giỏ
export const removeFromCartApi = async (cartItemId: string) => {
  const res = await axiosInstance.delete(`/carts/items/${cartItemId}`);
  return res.data;
};

// 🧹 Xóa toàn bộ giỏ hàng
export const clearCartApi = async () => {
  const res = await axiosInstance.delete("/carts/clear");
  return res.data;
};
