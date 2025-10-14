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

            if (existingItem) {
                // Si le produit existe déjà, augmente la quantité
                updatedCart = state.cart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                // Sinon, ajoute le produit avec une quantité initiale de 1
                updatedCart = [
                    ...state.cart,
                    {
                        ...product,
                        quantity: 1,
                        image: product.image_url ?
                            `/images/arbres/${product.image_url}.webp`
                            : "/images/default.png",
                    },
                ];
            }

            localStorage.setItem("cart", JSON.stringify(updatedCart)); // Mise à jour du stockage
            return { cart: updatedCart };
        }),

    // Supprime un produit du panier
    removeFromCart: (productId: string) =>
        set((state) => {
            const updatedCart = state.cart.filter((item) => item.id !== Number(productId));
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return { cart: updatedCart };
        }),

    // Modifie la quantité d'un produit
    updateQuantity: (productId: string, newQuantity: number) =>
        set((state) => {
            const updatedCart = state.cart.map((item) =>
                item.id === Number(productId) ? { ...item, quantity: Math.max(1, newQuantity) } : item
            );
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return { cart: updatedCart };
        }),

    // Vide complètement le panier
    clearCart: () =>
        set(() => {
            localStorage.removeItem("cart");
            return { cart: [] };
        }),
}));

export default useCartStore;
