import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Sale } from "../interfaces/shop";
import EditSaleModal from "../modals/EditSaleModal";


export default function ShopPage() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalEditOpen, setModalEditOpen] = useState(false);
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const role = localStorage.getItem("role_id");

    const fetchSales = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");
            let url = role === "1"
                ? "https://ape-back-9jp6.onrender.com/admin/sales"
                : "https://ape-back-9jp6.onrender.com/shop/sales";

            const response = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP ${response.status} : ${response.statusText}`);
            }

            const data = await response.json();
            setSales(data);
            console.log("📦 Données ventes :", data);
        } catch (error) {
            console.error("❌ Erreur de chargement :", error);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchSales();
    }, []);

    const handleDeleteSale = async (saleId: number) => {
        if (!confirm("Voulez-vous vraiment supprimer cette vente et tous ses produits ?")) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/admin/sales/${saleId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Erreur serveur");
            }

            alert("Vente supprimée avec succès !");
            fetchSales(); // recharge la liste
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (loading) return <div>Chargement...</div>;

    return (
        <div className="text-white container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold">Boutique</h1>
            <h2 className="text-2xl font-semibold mt-4">Vente du moment :</h2>

            <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {sales.map((sale) => (
                    <div key={sale.id}
                        className="block p-4 border rounded-lg hover:shadow-lg transition"
                    >
                        <h3 className="text-xl font-semibold">{sale.name}</h3>

                        <p className="text-gray-600">
                            {sale.is_active ? "🟢 En cours" : "🔴 Terminée"}
                        </p>

                        {sale.start_date && sale.end_date && (
                            <p className="text-sm text-gray-500">
                                Du{" "}
                                {new Date(sale.start_date).toLocaleDateString("fr-FR", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}{" "}
                                au{" "}
                                {new Date(sale.end_date).toLocaleDateString("fr-FR", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        )}
                        <Link to={`/cart/${sale.id}`} key={sale.id}>
                            {sale.picture && (
                                <img
                                    src={`http://localhost:5000${sale.picture}`}
                                    alt={`Image de la vente ${sale.name}`}
                                    className="w-full h-48 object-cover rounded mt-3"
                                />

                            )}
                        </Link>


                        {modalEditOpen && selectedSale && (
                            <EditSaleModal
                                sale={selectedSale}
                                onClose={() => setModalEditOpen(false)}
                                onUpdated={fetchSales} // pour rafraîchir la liste après modification
                            />
                        )}

                        {role === "1" && (
                            <div className="mt-4 flex gap-2">
                                <button
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                    onClick={() => {
                                        setSelectedSale(sale);
                                        setModalEditOpen(true);
                                    }}
                                >
                                    Modifier
                                </button>

                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    onClick={() => handleDeleteSale(sale.id)}
                                >
                                    Supprimer
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {role === "1" && (
                <Link to="/admin/create-sale">
                    <button className="mt-6 p-2 bg-blue-500 text-white rounded">
                        Ajouter une vente
                    </button>
                </Link>
            )}
        </div>
    );
}
