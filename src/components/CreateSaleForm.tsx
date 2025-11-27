import React, { useState, useEffect } from "react";
import type { ProductInput } from "../interfaces/shop";

export default function CreateSaleForm() {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [saleImageFile, setSaleImageFile] = useState<File | null>(null);

    const [products, setProducts] = useState<ProductInput[]>([
        { tempId: crypto.randomUUID(), name: "", price: "", stock: "0", description: "", imageFile: null },
    ]);

    const [loading, setLoading] = useState(false);

    // 🔄 Calcul automatique de isActive selon les dates
    useEffect(() => {
        if (startDate && endDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            setIsActive(today >= start && today <= end);
        } else {
            setIsActive(false);
        }
    }, [startDate, endDate]);

    const handleAddProduct = () => {
        setProducts(p => [
            ...p,
            { tempId: crypto.randomUUID(), name: "", price: "", stock: "0", description: "", imageFile: null },
        ]);
    };

    const handleRemoveProduct = (index: number) => {
        setProducts(p => p.filter((_, i) => i !== index));
    };

    const handleProductChange = (index: number, field: keyof ProductInput, value: any) => {
        setProducts(p => {
            const next = [...p];
            (next[index] as any)[field] = value;
            return next;
        });
    };

    const token = localStorage.getItem("token");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const validProducts = products.map(p => ({
                tempId: p.tempId,
                name: p.name.trim(),
                price: p.price.trim(),
                stock: Number(p.stock || 0),
                description: p.description || "",
            }));

            const formData = new FormData();

            formData.append("name", name);
            formData.append("start_date", startDate);
            formData.append("end_date", endDate);
            formData.append("products", JSON.stringify(validProducts));

            if (saleImageFile) {
                formData.append("saleImage", saleImageFile);
            }

            // --- ENVOI DES IMAGES PRODUITS AVEC TEMP-ID
            products.forEach(prod => {
                if (prod.imageFile) {
                    formData.append(`productImage_${prod.tempId}`, prod.imageFile);
                }
            });

            const res = await fetch("https://ape-back-9jp6.onrender.com/admin/sales", {
                method: "POST",
                body: formData,
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Erreur création vente");

            alert("✅ Vente créée !");
            // reset...
            setName("");
            setStartDate("");
            setEndDate("");
            setSaleImageFile(null);
            setProducts([{ tempId: crypto.randomUUID(), name: "", price: "", stock: "0", description: "", imageFile: null }]);

        } catch (err) {
            console.error(err);
            alert("Erreur création vente");
        } finally {
            setLoading(false);
        }
    };


    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto mt-20 bg-white p-6 rounded-lg shadow space-y-4"
        >
            <h2 className="text-xl font-semibold">Créer une vente</h2>

            <div>
                <label className="block text-sm font-medium">Nom</label>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full mt-1 border rounded px-3 py-2"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Début</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full mt-1 border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Fin</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="w-full mt-1 border rounded px-3 py-2"
                    />
                </div>
            </div>

            {/* 🟢 Affichage dynamique du statut */}
            <div className="flex items-center gap-3 mt-2">
                <span className={`px-2 py-1 rounded text-white text-sm ${isActive ? "bg-green-500" : "bg-red-500"}`}>
                    {isActive ? "Active aujourd’hui" : "Inactive aujourd’hui"}
                </span>

                <label className="text-sm">Image de la vente</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={e => setSaleImageFile(e.target.files?.[0] || null)}
                />
            </div>

            <div>
                <h3 className="font-medium">Produits</h3>
                <div className="space-y-3 mt-3">
                    {products.map((prod, i) => (
                        <div key={prod.id ?? prod.tempId} className="border rounded p-3 bg-gray-50">
                            <div className="flex justify-between items-start">
                                <strong>Produit {i + 1}</strong>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveProduct(i)}
                                    className="text-red-500"
                                >
                                    Supprimer
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <input
                                    placeholder="Nom"
                                    value={prod.name}
                                    onChange={e => handleProductChange(i, "name", e.target.value)}
                                    className="border rounded px-2 py-1"
                                    required
                                />
                                <input
                                    placeholder="Prix"
                                    value={prod.price}
                                    onChange={e => handleProductChange(i, "price", e.target.value)}
                                    className="border rounded px-2 py-1"
                                    required
                                />
                                <input
                                    placeholder="Stock"
                                    value={prod.stock}
                                    onChange={e => handleProductChange(i, "stock", e.target.value)}
                                    className="border rounded px-2 py-1"
                                />
                                <input
                                    type="file"
                                    accept="image/*, .pdf"
                                    onChange={e => handleProductChange(i, "imageFile", e.target.files?.[0] || null)}
                                />

                            </div>

                            <textarea
                                placeholder="Description"
                                value={prod.description}
                                onChange={e => handleProductChange(i, "description", e.target.value)}
                                className="w-full mt-2 border rounded px-2 py-1"
                            />
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={handleAddProduct}
                    className="mt-3 px-3 py-1 bg-blue-600 text-white rounded"
                >
                    Ajouter un produit
                </button>
            </div>

            <div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded"
                    disabled={loading}
                >
                    {loading ? "Enregistrement..." : "Créer la vente"}
                </button>
            </div>
        </form>
    );
}
