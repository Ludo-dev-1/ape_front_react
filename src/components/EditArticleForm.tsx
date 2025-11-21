// src/components/EditArticleForm.tsx
import React, { useState } from "react";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

interface EditArticleFormProps {
    articleId: string;
    initialTitre: string;
    initialContenuBref: string;
    initialContenu: string;
    initialImage: string;
}

const EditArticleForm: React.FC<EditArticleFormProps> = ({
    articleId,
    initialTitre,
    initialContenuBref,
    initialContenu,
    initialImage,
}) => {
    const [titre, setTitre] = useState(initialTitre);
    const [contenuBref, setContenuBref] = useState(initialContenuBref);
    const [contenu, setContenu] = useState(initialContenu);
    const [image, setImage] = useState<File | string | null>(initialImage);

    const handleEdit = async (event: React.FormEvent) => {
        event.preventDefault();

        let data: any;
        let fetchOptions: RequestInit;

        if (image instanceof File) {
            data = new FormData();
            data.append("titre", titre);
            data.append("contenu", contenu);
            data.append("image", image);
            fetchOptions = {
                method: "PUT",
                body: data,
            };
        } else {
            data = { titre, contenu, image: image || "" };
            fetchOptions = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            };
        }

        try {
            const response = await fetch(
                `https://ape-back-9jp6.onrender.com/bureau/articles/${articleId}`,
                fetchOptions
            );

            if (response.ok) {
                iziToast.success({
                    title: "Succès",
                    message: "L'article a bien été modifié !",
                    position: "topRight", // Optionnel
                });

                setTimeout(() => {
                    window.location.href = `/news/${articleId}`;
                }, 1500); // ⏳ petit délai pour laisser le toast s'afficher
            } else {
                iziToast.error({
                    title: "Erreur",
                    message: "Erreur lors de la mise à jour.",
                });
            }
        } catch (err) {
            console.error(err);
            iziToast.error({
                title: "Erreur",
                message: "Une erreur est survenue.",
            });
        }
    };

    return (
        <form onSubmit={handleEdit} className="space-y-4">
            <div>
                <label className="block font-medium">Titre</label>
                <input
                    type="text"
                    value={titre}
                    onChange={(e) => setTitre(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    name="titre"
                />
            </div>
            <div>
                <label className="block font-medium">Contenu</label>
                <textarea
                    value={contenu}
                    onChange={(e) => setContenu(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    name="contenu"
                />
            </div>
            <div>
                <label className="block font-medium">Contenu bref</label>
                <textarea
                    value={contenuBref}
                    onChange={(e) => setContenuBref(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    name="contenu"
                />
            </div>
            <div>
                <label className="block font-medium">Image (URL)</label>
                <input
                    className="w-full border px-3 py-2 rounded cursor-pointer"
                    type="file"
                    name="image"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setImage(e.target.files[0]);
                        } else {
                            setImage(null);
                        }
                    }}
                    accept="image/*"
                    required
                />
            </div>
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
            >
                Mettre à jour
            </button>
            <div className="mt-8">
                <a href="/news" className="text-blue-600 hover:underline">
                    ← Retour aux actualités
                </a>
            </div>
        </form>
    );
};

export default EditArticleForm;
