// src/hooks/useCart.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToCartApi, clearCartApi, getCart, removeFromCartApi } from "@/apis/cart.api";

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

  // Xóa sản phẩm
  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeFromCartApi(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CART_KEY }),
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
    removeFromCart: removeMutation.mutate,
    clearCart: clearMutation.mutate,
  };
};
