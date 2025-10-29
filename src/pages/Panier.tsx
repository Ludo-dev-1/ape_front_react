import { Link } from "react-router";
import useCartStore from "../stores/CartStore";
import { useAuthStore } from "../stores/AuthStore";
import { useState } from "react";

export default function Panier() {
    const cart = useCartStore((state) => state.cart);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const clearCart = useCartStore((state) => state.clearCart);
    const isAuthenticated = useAuthStore((state) => state.token !== null);
    const [loading, setLoading] = useState(false);

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            alert("Veuillez vous connecter pour passer à la caisse.");
            return;
        }
        setLoading(true);
        // Logique de passage à la caisse ici
        setLoading(false);
        alert("Passage à la caisse réussi !");
        clearCart();
    }
    if (cart.length === 0) {
        return (
            <div className="text-center mt-10">
                <p>Votre panier est vide.</p>
                <Link to="/shop" className="text-blue-500 underline">Retourner à la boutique</Link>
            </div>
        );
    }
    return (
        <div className="max-w-3xl mx-auto mt-10 p-4">
            <h1 className="text-2xl font-bold mb-6">Votre Panier</h1>
            <table className="w-full border-collapse mb-6">
                <thead>
                    <tr>
                        <th className="border-b p-2 text-left">Produit</th>
                        <th className="border-b p-2 text-left">Prix Unitaire</th>
                        <th className="border-b p-2 text-left">Quantité</th>
                        <th className="border-b p-2 text-left">Total</th>
                        <th className="border-b p-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item) => (
                        <tr key={item.id}>
                            <td className="border-b p-2 flex items-center gap-4">
                                <img
                                    src={`${import.meta.env.VITE_API_URL}${item.image_url}`}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded"
                                />

                                <span>{item.name}</span>
                            </td>
                            <td className="border-b p-2">{Number(item.price).toFixed(2)} €</td>
                            <td className="border-b p-2">
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id.toString(), Number(e.target.value))}
                                    className="w-16 border rounded px-2 py-1"
                                />
                            </td>
                            <td className="border-b p-2">{(item.price * item.quantity).toFixed(2)} €</td>
                            <td className="border-b p-2">
                                <button
                                    onClick={() => removeFromCart(item.id.toString())}
                                    className="text-red-500 underline"
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center mt-4">
                <h2 className="text-xl font-bold">Total: {totalPrice.toFixed(2)} €</h2>
                <button
                    onClick={handleCheckout}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? "Chargement..." : "Passer à la caisse"}
                </button>
            </div>
        </div>
    );
}