import { useEffect, useState } from "react";
import CreateEventButton from "../components/CreateEventButton";
import { Link } from "react-router";

type Event = {
    id: number;
    titre: string;
    description: string;
    date_event: string;
    image?: string | null;
};

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("https://ape-back-9jp6.onrender.com/events");
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error("Erreur lors du chargement des événements :", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();

        window.addEventListener("event-created", fetchEvents);

        return () => {
            window.removeEventListener("event-created", fetchEvents);
        };
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Chargement des événements...</p>
            </div>
        );
    }

    return (
        <>

            <section className="bg-slate-950 py-12">
                <div className="container mx-auto mt-16 px-4">
                    <h1 className="text-3xl font-bold mb-6 text-white">Nos événements</h1>
                    <p className="text-gray-300 mb-4">
                        Découvrez les événements à venir organisés par notre association et participez à la vie de l'école.
                        Les détails de chaque événement seront disponibles sur la page d'accueil lorsque l'événement sera en cours.
                    </p>

                    <CreateEventButton />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <div key={event.id} className="bg-slate-800 p-6 rounded-lg shadow-md">
                                <Link to={`/events/${event.id}`}>
                                    <h2 className="text-xl font-semibold mb-2 text-slate-100">{event.titre}</h2>
                                    <p className="text-gray-300 mb-4 h-20 overflow-hidden">
                                        {event.description.slice(0, 70)}...
                                    </p>
                                    <p>Prévu pour le {new Date(event.date_event).toLocaleDateString()}</p>
                                    {event.image && (
                                        <img
                                            src={event.image}
                                            alt={`Image de l'événement ${event.titre}`}
                                            className="w-full h-auto rounded max-h-48 object-cover mt-2"
                                        />
                                    )}

                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
