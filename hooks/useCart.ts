// src/hooks/useCart.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToCartApi, clearCartApi, getCart, removeFromCartApi, updateCartItem } from "@/apis/cart.api";
import { Alert } from "react-native";

const CART_KEY = ["cart"];

export const useCart = () => {
  const queryClient = useQueryClient();

  // 🧭 Lấy danh sách sản phẩm trong giỏ
  const { data: cart = [], isLoading } = useQuery({
    queryKey: CART_KEY,
    queryFn: getCart,
  });

  // Thêm sản phẩm
  const addMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      addToCartApi(productId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });

  // ❌ Xóa 1 sản phẩm khỏi giỏ
  const removeFromCart = useMutation({
    mutationFn: (id: string) => removeFromCartApi(id),
    onSuccess: (_, productId) => {
      // Cập nhật cache để xóa sản phẩm khỏi giao diện
      queryClient.setQueryData(CART_KEY, (oldData: any) => {
        if (!oldData?.data?.cartItems) return oldData;
        const updatedItems = oldData.data.cartItems.filter(
          (item: any) => item.id !== productId
        );
        return { ...oldData, data: { ...oldData.data, cartItems: updatedItems } };
      });
      Alert.alert("Thành công", "Đã xóa sản phẩm khỏi giỏ hàng!");
    },
    onError: (error: any) => {
      Alert.alert("Lỗi", error.response?.data?.message || "Xóa sản phẩm thất bại!");
    },
  });

  // Cập nhật số lượng
  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      updateCartItem(id, quantity),
    onSuccess: (_, variables) => {
      // cập nhật dữ liệu giỏ hàng ngay (không cần chờ refetch)
      queryClient.setQueryData(CART_KEY, (oldData: any) => {
        if (!oldData?.data?.cartItems) return oldData;
        const updatedItems = oldData.data.cartItems.map((item: any) =>
          item.id === variables.id ? { ...item, quantity: variables.quantity } : item
        );
        return { ...oldData, data: { ...oldData.data, cartItems: updatedItems } };
      });
      console.log("✅ Cập nhật số lượng thành công!");
    },
    onError: (error: any) => {
      console.log("❌ Cập nhật thất bại:", error.response?.data || error.message);
    },
  });

  // Xóa toàn bộ giỏ
  const clearMutation = useMutation({
    mutationFn: clearCartApi,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
  });

  return {
    cart,
    isLoading,
    addToCart: addMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeFromCart: removeFromCart.mutate,
    clearCart: clearMutation.mutate,
  };
};
