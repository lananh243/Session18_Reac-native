import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import "react-native-reanimated";

export default function RootLayout() {
    const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            {/* Màn hình chi tiết sản phẩm, hiển thị dạng modal */}
            <Stack.Screen
                name="product-detail"
                options={{
                presentation: "modal",
                headerShown: false, // Ẩn header mặc định để tự custom
                }}
            />
        </Stack>
    </QueryClientProvider>
    
  );
}
