import { create } from "zustand";
import type { CartState } from "../interfaces/shop";
import type { Product } from "../interfaces/shop";

// Charge le panier depuis le localStorage
const loadCartFromStorage = (): Product[] => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
};

// Création du store Zustand pour gérer le panier
const useCartStore = create<CartState>((set) => ({
    cart: loadCartFromStorage(), // Chargement initial depuis localStorage

    // Ajoute un produit au panier
    addToCart: (product: Product) =>
        set((state) => {

            const existingItem = state.cart.find((item) => item.id === product.id);
            let updatedCart;

            // --- correction : l'URL de l'image est directement celle de Supabase ---
            const resolvedImage =
                product.image_url && product.image_url.trim() !== ""
                    ? product.image_url
                    : "/images/default.png";

            if (existingItem) {
                // Produit existant → augmente la quantité
                updatedCart = state.cart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                updatedCart = [
                    ...state.cart,
                    {
                        ...product,
                        quantity: 1,
                        image: resolvedImage, // <--- plus de /uploads/
                    },
                ];
            }

            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return { cart: updatedCart };
        }),

    // Supprime un produit du panier
    removeFromCart: (productId: string) =>
        set((state) => {
            const updatedCart = state.cart.filter((item) => item.id !== Number(productId));
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return { cart: updatedCart };
        }),

    // Modifie la quantité
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

    // Vide le panier
    clearCart: () =>
        set(() => {
            localStorage.removeItem("cart");
            return { cart: [] };
        }),
}));

export default useCartStore;
