import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import EventActions from "../components/EventActions";

type Event = {
    id: number;
    titre: string;
    description: string;
    date_event: string;
    date_publication?: string;
    image?: string | null;
};

export default function EventDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<Event | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`http://localhost:5000/event/${id}`);
                const data = await response.json();
                setEvent(data);
            } catch (error) {
                console.error("Erreur lors du chargement de l'événement :", error);
            }
        };

        if (id) fetchEvent();
    }, [id]);

    if (!event) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Chargement de l'événement...</p>
            </div>
        );
    }

    return (
        <>

            <section className="bg-white py-12">
                <div className="container mx-auto px-4 max-w-3xl flex flex-col items-center">
                    <h1 className="text-3xl font-bold mb-6">{event.titre}</h1>
                    <p className="text-gray-600 mb-2 text-sm">
                        Publié le{" "}
                        {event.date_publication
                            ? new Date(event.date_publication).toLocaleDateString("fr-FR")
                            : ""}
                    </p>
                    <div className="mt-6 text-gray-800 leading-relaxed whitespace-pre-line">
                        {event.description}
                    </div>
                    {event.image && (
                        <img
                            src={`http://localhost:5000${event.image}`}
                            alt={`Image de ${event.titre}`}
                            className="mt-6 w-full h-auto rounded-lg shadow-md"
                        />
                    )}
                    <div className="mt-8">
                        <Link to="/events" className="text-blue-600 hover:underline">
                            ← Retour aux événements
                        </Link>
                    </div>

                    {/* Boutons conditionnels */}
                    <EventActions eventId={event.id} />
                </div>
            </section>

        </>
    );
}
