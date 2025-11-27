import React, { useState, useEffect } from "react";
import type { Sale, ProductInput } from "../interfaces/shop";

interface EditSaleModalProps {
    sale: Sale;
    onClose: () => void;
    onUpdated: () => void;
}

export default function EditSaleModal({ sale, onClose, onUpdated }: EditSaleModalProps) {
    const [name, setName] = useState(sale.name);
    const [startDate, setStartDate] = useState(
        sale.start_date
            ? (typeof sale.start_date === "string" && (sale.start_date as string).includes("T"))
                ? (sale.start_date as string).split("T")[0]
                : new Date(sale.start_date).toISOString().split("T")[0]
            : ""
    );
    const [endDate, setEndDate] = useState(
        sale.end_date
            ? (typeof sale.end_date === "string" && (sale.end_date as string).includes("T"))
                ? (sale.end_date as string).split("T")[0]
                : new Date(sale.end_date as unknown as Date).toISOString().split("T")[0]
            : ""
    );

    const [saleImageFile, setSaleImageFile] = useState<File | null>(null);
    const [products, setProducts] = useState<ProductInput[]>([]);
    const [loading, setLoading] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const token = localStorage.getItem("token");

    // Charger les produits
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`https://ape-back-9jp6.onrender.com/admin/sales/${sale.id}/products`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) throw new Error("Erreur chargement produits");

                const data = await res.json();

                setProducts(
                    data.map((p: any) => ({
                        id: p.id,
                        tempId: crypto.randomUUID(),
                        name: p.name,
                        price: p.price.toString(),
                        stock: p.stock?.toString() || "0",
                        description: p.description || "",
                        imageFile: null,
                        image_url: p.image_url,
                    }))
                );
            } catch (err) {
                console.error(err);
            }
        };

        fetchProducts();
    }, [sale.id, token]);

    // Calcul de isActive
    useEffect(() => {
        if (startDate && endDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const s = new Date(startDate);
            const e = new Date(endDate);
            e.setHours(23, 59, 59, 999);

            setIsActive(today >= s && today <= e);
        } else {
            setIsActive(false);
        }
    }, [startDate, endDate]);

    const handleProductChange = (idx: number, field: keyof ProductInput, value: any) => {
        setProducts(prev => {
            const copy = [...prev];
            (copy[idx] as any)[field] = value;
            return copy;
        });
    };

    const handleAddProduct = () => {
        setProducts(prev => [
            ...prev,
            {
                tempId: crypto.randomUUID(),
                name: "",
                price: "",
                stock: "0",
                description: "",
                imageFile: null,
                image_url: "",
            },
        ]);
    };

    const handleRemoveProduct = (index: number) => {
        setProducts(prev => prev.filter((_, i) => i !== index));
    };

    // -------------------------------
    //          SUBMIT PATCH
    // -------------------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Produits valides
            const validProducts = products.map(p => ({
                id: p.id,
                tempId: p.tempId,
                name: p.name.trim(),
                price: p.price.trim(),
                stock: Number(p.stock || 0),
                description: p.description || "",
            }));

            const formData = new FormData();

            formData.append("name", name);
            formData.append("start_date", startDate || "");
            formData.append("end_date", endDate || "");
            formData.append("is_active", isActive ? "true" : "false");
            formData.append("products", JSON.stringify(validProducts));

            // Nouvelle image de vente
            if (saleImageFile) formData.append("saleImage", saleImageFile);

            // Images produits — VERSION CORRECTE ⬇
            products.forEach(prod => {
                if (prod.imageFile) {
                    formData.append(`productImage_${prod.tempId}`, prod.imageFile);
                }
            });

            const res = await fetch(`https://ape-back-9jp6.onrender.com/admin/sales/${sale.id}`, {
                method: "PATCH",
                body: formData,
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Erreur mise à jour de la vente");

            alert("✅ Vente mise à jour !");
            onUpdated();
            onClose();
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Erreur mise à jour");
        } finally {
            setLoading(false);
        }
    };

    // -------------------------------
    //             UI
    // -------------------------------
    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto text-black">
                <h2 className="text-xl font-semibold mb-4">Modifier la vente</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Nom</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full mt-1 border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Fin</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full mt-1 border rounded px-3 py-2"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm">Nouvelle image</label>
                        <input type="file" accept="image/*" onChange={(e) => setSaleImageFile(e.target.files?.[0] || null)} />
                    </div>

                    <div>
                        <h3 className="font-medium">Produits</h3>

                        <div className="space-y-3 mt-3">
                            {products.map((prod, i) => (
                                <div key={prod.id ?? prod.tempId} className="border rounded p-3 bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <strong>Produit {i + 1}</strong>
                                        <button type="button" onClick={() => handleRemoveProduct(i)} className="text-red-500">
                                            Supprimer
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        <input
                                            placeholder="Nom"
                                            value={prod.name}
                                            onChange={(e) => handleProductChange(i, "name", e.target.value)}
                                            className="border rounded px-2 py-1"
                                            required
                                        />
                                        <input
                                            placeholder="Prix"
                                            value={prod.price}
                                            onChange={(e) => handleProductChange(i, "price", e.target.value)}
                                            className="border rounded px-2 py-1"
                                            required
                                        />
                                        <input
                                            placeholder="Stock"
                                            value={prod.stock}
                                            onChange={(e) => handleProductChange(i, "stock", e.target.value)}
                                            className="border rounded px-2 py-1"
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleProductChange(i, "imageFile", e.target.files?.[0] || null)}
                                        />
                                    </div>

                                    <textarea
                                        placeholder="Description"
                                        value={prod.description}
                                        onChange={(e) => handleProductChange(i, "description", e.target.value)}
                                        className="w-full mt-2 border rounded px-2 py-1"
                                    />

                                    {prod.image_url && !prod.imageFile && (
                                        <img
                                            src={prod.image_url}
                                            alt="Produit existant"
                                            className="w-24 h-24 mt-2 object-cover rounded"
                                        />
                                    )}
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

                    <div className="flex justify-end gap-3 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded"
                            disabled={loading}
                        >
                            {loading ? "Mise à jour..." : "Mettre à jour"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
