import axiosInstance from "@/utils/axiosInstance"

// Gọi API lấy danh sách sản phẩm
export const getAllProduct = async () => {
    const response = await axiosInstance.get("products/all");
    return response.data;
}

export const getProductDetail = async (id: string) => {
    const response = await axiosInstance.get(`products/${id}`);
    return response.data;
}