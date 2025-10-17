import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { getProductDetail } from "@/apis/product.api";

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const productId = Array.isArray(id) ? id[0] : id;

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await getProductDetail(productId);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Không tìm thấy sản phẩm.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: product.productName || "Chi tiết sản phẩm" }} />

      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="#333" />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        {product.images?.[0]?.url ? (
          <Image source={{ uri: product.images[0].url }} style={styles.productImage} />
        ) : (
          <View style={styles.noImage}>
            <Text>Không có hình ảnh</Text>
          </View>
        )}

        <View style={styles.details}>
          <Text style={styles.name}>{product.productName}</Text>
          <Text style={styles.price}>
            {product?.price
              ? `${Number(product.price).toLocaleString()}₫`
              : "Giá đang cập nhật"}
          </Text>

          <Text style={styles.desc}>{product.description || "Chưa có mô tả"}</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cartButton}>
          <Ionicons name="cart-outline" size={24} color="#fff" />
          <Text style={styles.cartText}>Thêm vào giỏ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff"},
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  backButton: { position: "absolute", top: 25, left: 10, zIndex: 10 },
  productImage: { width: "100%", height: 300, resizeMode: "contain" },
  noImage: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  details: { padding: 20 },
  name: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  price: { fontSize: 20, color: "#e53e3e", marginBottom: 16 },
  desc: { fontSize: 16, color: "#555", lineHeight: 22 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  cartButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 25,
  },
  cartText: { color: "#fff", fontSize: 16, marginLeft: 8 },
  errorText: { color: "red", fontSize: 18 },
});
