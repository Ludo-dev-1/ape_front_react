import React, { useState } from "react";

interface CreateEventModalProps {
    onEventCreated: (event: any) => void;
}

export default function CreateEventModal({ onEventCreated }: CreateEventModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [titre, setTitre] = useState("");
    const [description, setDescription] = useState("");
    const [date_event, setDateEvent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("titre", titre);
            formData.append("description", description);
            formData.append("date_event", date_event);
            if (image) {
                formData.append("image", image);
            }

            const res = await fetch("http://localhost:5000/bureau/events", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Erreur lors de la création de l'article");
            }

            const newEvent = await res.json();

            // Après création réussie
            const handleSuccess = (newEvent: any) => {
                const event = new CustomEvent("event-created", {
                    detail: newEvent,
                    bubbles: true,
                });
                window.dispatchEvent(event);
                setIsOpen(false);
            };



            // On informe le parent / liste d'événements du nouvel événement créé
            handleSuccess(newEvent)
            // Réinitialiser le formulaire
            setTitre("");
            setDescription("");
            setDateEvent("");
            setImage(null);
            setError(null);
            setIsOpen(false);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Une erreur inconnue est survenue");
            }
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4 cursor-pointer"
            >
                + Créer un événement
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Créer un nouvel événements</h2>
                        {error && <p className="text-red-600 mb-3">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                                type="text"
                                name="titre"
                                value={titre}
                                onChange={(e) => setTitre(e.target.value)}
                                placeholder="Titre"
                                className="w-full border p-2"
                                required
                            />
                            <textarea
                                name="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Description"
                                className="w-full border p-2"
                                required
                            />
                            <input
                                type="date"
                                name="date_event"
                                value={date_event}
                                onChange={(e) => setDateEvent(e.target.value)}
                                className="w-full border p-2"
                                required
                            />
                            <input
                                className="w-full border p-2 cursor-pointer"
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

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-600 hover:underline cursor-pointer"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
                                >
                                    Publier
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
