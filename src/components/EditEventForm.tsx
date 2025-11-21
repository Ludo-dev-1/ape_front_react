// src/components/EditArticleForm.tsx
import React, { useState } from "react";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

interface EditEventFormProps {
    eventId: string;
    initialTitre: string;
    initialDescription: string;
    initialImage: string;
    initialDateEvent: string;
}

const EditEventForm: React.FC<EditEventFormProps> = ({
    eventId,
    initialTitre,
    initialDescription,
    initialImage,
    initialDateEvent,
}) => {
    const [titre, setTitre] = useState(initialTitre);
    const [description, setDescription] = useState(initialDescription);
    const [image, setImage] = useState<File | string | null>(initialImage);
    const [date_event, setDateEvent] = useState(initialDateEvent || "");

    const handleEdit = async (event: React.FormEvent) => {
        event.preventDefault();

        let data: any;
        let fetchOptions: RequestInit;

        if (image instanceof File) {
            data = new FormData();
            data.append("titre", titre);
            data.append("description", description);
            data.append("date_event", date_event);
            data.append("image", image);
            fetchOptions = {
                method: "PUT",
                body: data,
            };
        } else {
            data = { titre, description, date_event, image: image || "" };
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
                `https://ape-back-9jp6.onrender.com/bureau/events/${eventId}`,
                fetchOptions
            );

            if (response.ok) {
                iziToast.success({
                    title: "Succès",
                    message: "L'article a bien été modifié !",
                    position: "topRight", // Optionnel
                });

                setTimeout(() => {
                    window.location.href = `/events/${eventId}`;
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
                <label className="block font-medium">Date de l'événement</label>
                <input
                    type="date"
                    value={date_event}
                    onChange={(e) => setDateEvent(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    name="date_event"
                />
            </div>
            <div>
                <label className="block font-medium">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    name="description"
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

export default EditEventForm;
