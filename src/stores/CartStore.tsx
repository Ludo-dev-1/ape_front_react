import { create } from "zustand";
import type { CartState } from "../interfaces/shop";
import type { Product } from "../interfaces/shop";

// Charge le panier depuis localStorage
const loadCartFromStorage = (): Product[] => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
};

const useCartStore = create<CartState>((set) => ({
    cart: loadCartFromStorage(),

    // Ajoute un produit au panier
    addToCart: (product: Product) =>
        set((state) => {
            const existingItem = state.cart.find((item) => item.id === product.id);
            let updatedCart;

            // --- Sécurisation de l'image ---
            const resolvedImage =
                product.image_url && product.image_url !== "" && product.image_url !== "undefined"
                    ? product.image_url            // URL Supabase déjà complète
                    : "/images/default.png";       // Image de fallback

            if (existingItem) {
                updatedCart = state.cart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                updatedCart = [
                    ...state.cart,
                    {
                        ...product,
                        quantity: 1,
                        image: resolvedImage, // <-- FINI les /uploads/
                    },
                ];
            }

            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return { cart: updatedCart };
        }),

    // Supprimer
    removeFromCart: (productId: string) =>
        set((state) => {
            const updatedCart = state.cart.filter(
                (item) => item.id !== Number(productId)
            );
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return { cart: updatedCart };
        }),

    // Modifier quantité
    updateQuantity: (productId: string, newQuantity: number) =>
        set((state) => {
            const updatedCart = state.cart.map((item) =>
                item.id === Number(productId)
                    ? { ...item, quantity: Math.max(1, newQuantity) }
                    : item
            );
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return { cart: updatedCart };
        }),

    // Vider panier
    clearCart: () =>
        set(() => {
            localStorage.removeItem("cart");
            return { cart: [] };
        }),
}));

export default useCartStore;
