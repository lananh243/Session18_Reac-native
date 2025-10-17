import { Product } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "@products";

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const getProducts = useCallback(async () => {
        try {
            setLoading(true);
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            const productsFromStorage = jsonValue != null ? JSON.parse(jsonValue) : [];
            setProducts(productsFromStorage);
        } catch (error) {
            console.error("Lỗi khi tải danh sách sản phẩm, error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getProducts();
    }, [getProducts]);

    const getProductById = (id: string): Product | undefined => {
        return products.find((p) => p.id === id);
    };

    return {products, loading, getProductById};
}