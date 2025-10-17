import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
    ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllProduct } from "@/apis/product.api";
import { ProductCardProps } from "@/types";
import { useCart } from "@/hooks/useCart";



const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const router = useRouter();
  const {addToCart} = useCart();

  const handleAddToCart = () => {
    addToCart(
      { productId: item.id, quantity: 1 },
      {
        onSuccess: () => {
          Alert.alert("Thành công", "Sản phẩm đã được thêm vào giỏ hàng!");
        },
        onError: (error) => {
          Alert.alert("Thất bại", "Không thể thêm sản phẩm vào giỏ hàng!");
        },
      }
    );
  };

  return (
    <View style={styles.card}>
      <Image
        source={{ uri: item?.images[0]?.url }}
        style={styles.image}
        resizeMode="contain"
      />
      <Text
        onPress={() =>
          router.push({
            pathname: "/product-detail",
            params: { id: item.id },
          })
        }
        style={styles.title}
        numberOfLines={2}
      >
        {item.productName}
      </Text>
      <Text style={styles.price}>{item.price.toLocaleString("vi-VN")} VNĐ</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/cart")} // Chuyển hướng qua trang giỏ hàng khi nhấn
      >
        <Ionicons name="add" size={20} color="white" />
        <Text style={styles.addButtonText} onPress={handleAddToCart}>Thêm vào giỏ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function ProductsScreen() {
    const {
        data: products,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["products"],
        queryFn: getAllProduct,
    });

    if (isLoading) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    if (isError) {
        return <Text>Đã có lỗi xảy ra khi tải dữ liệu.</Text>;
    }
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Cửa hàng" }} />
      <FlatList
        data={products?.data || []}
        renderItem={({ item }) => <ProductCard item={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  listContainer: { padding: 8 },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 10,
    margin: 8,
    padding: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: { width: "100%", height: 120, marginBottom: 10 },
  title: { fontSize: 14, fontWeight: "600", textAlign: "center", height: 40 },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e53e3e",
    marginVertical: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addButtonText: { color: "white", fontWeight: "bold", marginLeft: 4 },
});
