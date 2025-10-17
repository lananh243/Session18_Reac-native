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

// ❌ Xóa 1 sản phẩm khỏi giỏ
export const removeFromCartApi = async (productId: string) => {
  const res = await axiosInstance.delete(`/carts/${productId}`);
  return res.data;
};

// 🧹 Xóa toàn bộ giỏ hàng
export const clearCartApi = async () => {
  const res = await axiosInstance.delete("/carts");
  return res.data;
};
