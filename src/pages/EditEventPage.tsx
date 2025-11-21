// src/pages/EditEventPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditEventForm from "../components/EditEventForm";

type Event = {
    id: number;
    titre: string;
    description: string;
    date_event: string;
    image?: string | null;
};

export default function EditEventPage() {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<Event | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`https://ape-back-9jp6.onrender.com/event/${id}`);
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
        <section className="bg-white py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-2xl font-bold mb-6">Modifier l'événement</h1>
                <EditEventForm
                    eventId={event.id.toString()}
                    initialTitre={event.titre}
                    initialDescription={event.description}
                    initialDateEvent={event.date_event}
                    initialImage={event.image ?? ""}
                />
            </div>
        </section>
    );
}
