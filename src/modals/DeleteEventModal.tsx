import { useState } from "react";

interface DeleteEventModalProps {
    eventId: string;
    onEventDeleted: () => void;
}

const DeleteEventModal: React.FC<DeleteEventModalProps> = ({
    eventId,
    onEventDeleted,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await fetch(`https://ape-back-9jp6.onrender.com/bureau/events/${eventId}`, {
                method: "DELETE",
            });
            onEventDeleted();

        } catch (error) {
            console.error("Erreur lors de la suppression de l'article:", error);
        } finally {
            setIsOpen(false);
            window.location.href = "/events";
        }
    };

    return (
        <>
            <button onClick={() => setIsOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4 cursor-pointer">Supprimer l'événement</button>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-slate-400 p-6 rounded shadow-md w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4 text-black">Confirmer la suppression</h2>
                        <p className="mb-4 text-black">Êtes-vous sûr de vouloir supprimer cet événement ?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                Confirmer
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 "
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default DeleteEventModal;
