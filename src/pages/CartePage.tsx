import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Product } from "../interfaces/shop";
import useCartStore from "../stores/CartStore";

export default function CartPage() {
    const { saleId } = useParams<{ saleId: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const addToCart = useCartStore((state) => state.addToCart);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (!saleId) throw new Error("ID de vente manquant");

                const res = await fetch(`https://ape-back-9jp6.onrender.com/shop/sales/${saleId}/products`);

                console.log(res);

                if (!res.ok) throw new Error("Erreur lors du chargement des produits");

                const data: Product[] = await res.json(); // contient saleName et is_active
                setProducts(data);
                console.log("data récupérée:", data);


            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [saleId]);

    const handleDeleteProduct = async (productId: number) => {
        if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`https://ape-back-9jp6.onrender.com/admin/products/${productId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Erreur serveur");
            }
            alert("Produit supprimé avec succès !");
            setProducts(products.filter((p) => p.id !== productId));
        }
        catch (err: any) {
            alert(err.message);
        }
    };



    if (loading) return <p className="text-center mt-10">Chargement...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
    if (products.length === 0) return <p className="text-center mt-10">Aucun produit trouvé.</p>;

    const saleName = products[0].saleName; // récupère saleName depuis le premier produit
    const saleIsActive = products[0].is_active; // récupère is_active depuis le premier produit

    return (
        <div className="container mx-auto px-4 mt-20 py-10 ">
            <h1 className="text-3xl font-bold mb-6 text-white">🛒 Vente : {saleName}</h1>

            <div className=" p-6 rounded-lg shadow-md mb-8 bg-slate-800">
                <p>
                    <strong>Statut :</strong>{" "}
                    {saleIsActive ? (
                        <span className="text-green-600 font-semibold ">En cours</span>
                    ) : (
                        <span className="text-red-600 font-semibold">Terminée</span>
                    )}
                </p>
            </div>

            <h2 className="text-2xl font-semibold mb-4 text-white">Produits disponibles :</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                    <div key={product.id} className="border p-4 rounded-lg shadow hover:shadow-lg transition">
                        <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                        <p className="text-gray-600">{product.price} €</p>
                        {product.image_url && (
                            product.image_url.toLowerCase().endsWith(".pdf") ? (
                                <Link
                                    to={product.image_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block mt-3 text-blue-400 underline hover:text-blue-600"
                                >
                                    📄 Voir le document PDF
                                </Link>
                            ) : (
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="w-full h-48 object-cover rounded mt-2"
                                />
                            )
                        )}

                        <p className="mt-2 text-sm text-white">{product.description}</p>

                        {!(product.image_url && product.image_url.toLowerCase().endsWith(".pdf")) && (
                            <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                onClick={() => (addToCart(product))}>
                                Ajouter au panier
                            </button>
                        )}
                        <button className="mt-3 bg-red-600 ml-4 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                            onClick={() => handleDeleteProduct(product.id)}>
                            Supprimer
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <Link to="/boutique" className="text-gray-200 hover:bg-gray-700 px-4 py-2 rounded">
                    ← Retour a la boutique
                </Link>
            </div>
        </div>
    );
}
