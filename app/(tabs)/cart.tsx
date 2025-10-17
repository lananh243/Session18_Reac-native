import { useCart } from "@/hooks/useCart";
import { CartItemProps } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Dữ liệu giỏ hàng fix cứng
// const CART_ITEMS = [
//   {
//     id: "1",
//     name: "Áo thun Premium Slim Fit",
//     price: 350000,
//     quantity: 1,
//     image:
//       "https://product.hstatic.net/200000471735/product/mts215s5-2-w01_3__fabd997abd6841eca0efa71ddaa2319f.jpg",
//   },
//   {
//     id: "2",
//     name: "Ổ cứng di động WD 2TB",
//     price: 1850000,
//     quantity: 2,
//     image:
//       "https://western.com.vn/media/product/49_hdd_wd_elements_2tb_25_inch_wdbu6y0020bbk__2_.jpg",
//   },
//   {
//     id: "3",
//     name: "Vòng tay rồng John Hardy",
//     price: 12500000,
//     quantity: 1,
//     image:
//       "https://cdn.xaxi.vn/trangsuc/img/john-hardy-modern-chain-mens-bracelet-bmp9995362dixm.jpg",
//   },
// ];

// type CartItemType = (typeof CART_ITEMS)[number];
// type CartItemProps = { item: CartItemType };

const CartItem: React.FC<CartItemProps> = ({ item, onRemove }) => {
  const { updateQuantity } = useCart();

  const handleIncrease = () => {
    updateQuantity({ id: item.id, quantity: item.quantity + 1 });
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity({ id: item.id, quantity: item.quantity - 1 });
    } else {
      Alert.alert("Thông báo", "Số lượng không thể nhỏ hơn 1");
    }
  };

  return (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: item.productImage }}
        style={styles.itemImage}
        resizeMode="contain"
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.productName}
        </Text>
        <Text style={styles.itemPrice}>
          {item.price.toLocaleString("vi-VN")} VNĐ
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={handleDecrease}>
            <Ionicons name="remove-circle-outline" size={28} color="#555" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity onPress={handleIncrease}>
            <Ionicons name="add-circle-outline" size={28} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={onRemove}>
        <Ionicons name="trash-outline" size={24} color="#e53e3e" />
      </TouchableOpacity>
    </View>
  );
};


const CartSummary = () => (
  <View style={styles.summaryContainer}>
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>Tạm tính</Text>
      <Text style={styles.summaryValue}>14.700.000 VNĐ</Text>
    </View>
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
      <TextInput keyboardType="numeric" style={styles.textInput} />
    </View>
    <View style={styles.separator} />
    <View style={styles.summaryRow}>
      <Text style={styles.totalLabel}>Tổng cộng</Text>
      <Text style={styles.totalValue}>14.700.000 VNĐ</Text>
    </View>
  </View>
);

export default function CartScreen() {
  const { cart, isLoading, removeFromCart, clearCart } = useCart();
  if (isLoading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Giỏ hàng của bạn" }} />

      {cart?.data?.cartItems?.length > 0 && (
    <TouchableOpacity
      style={styles.clearButton}
      onPress={() => {
        Alert.alert(
          "Xác nhận",
          "Bạn có chắc muốn xóa toàn bộ giỏ hàng không?",
          [
            { text: "Hủy" },
            { text: "Xóa tất cả", style: "destructive", onPress: () => clearCart() },
          ]
        );
      }}
    >
      <Text style={styles.clearButtonText}>🗑️ Xóa toàn bộ giỏ hàng</Text>
    </TouchableOpacity>
  )}
      <FlatList
        data={cart?.data?.cartItems || []}
        renderItem={({ item }) => <CartItem item={item} 
          onRemove={() => {
              Alert.alert(
                "Xác nhận",
                "Bạn có chắc muốn xóa sản phẩm này?",
                [
                  { text: "Hủy" },
                  { text: "Xóa", onPress: () => removeFromCart(item.id) },
                ]
              );
            }}/>}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={<CartSummary />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  // CartItem styles
  itemContainer: {
    flexDirection: "row",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemImage: { width: 80, height: 80, borderRadius: 8 },
  itemDetails: { flex: 1, marginLeft: 15, justifyContent: "space-between" },
  itemName: { fontSize: 16, fontWeight: "600" },
  itemPrice: { fontSize: 16, fontWeight: "bold", color: "#e53e3e" },
  quantityContainer: { flexDirection: "row", alignItems: "center" },
  quantityText: { fontSize: 18, fontWeight: "bold", marginHorizontal: 15 },
  // Summary styles
  summaryContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fafafa",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryLabel: { fontSize: 16, color: "#666" },
  summaryValue: { fontSize: 16, fontWeight: "500" },
  separator: { height: 1, backgroundColor: "#e0e0e0", marginVertical: 10 },
  totalLabel: { fontSize: 18, fontWeight: "bold" },
  totalValue: { fontSize: 18, fontWeight: "bold", color: "#e53e3e" },
  // Empty state styles
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyText: { marginTop: 10, fontSize: 16, color: "#888" },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    width: 150,
    height: 32,
    paddingHorizontal: 10,
    paddingVertical: 4,
    color: "#333",
  },
  clearButton: {
  backgroundColor: "#ffe6e6",
  padding: 12,
  marginHorizontal: 15,
  marginTop: 10,
  borderRadius: 10,
  alignItems: "center",
  },
  clearButtonText: {
    color: "#e53e3e",
    fontSize: 16,
    fontWeight: "bold",
  },
});
