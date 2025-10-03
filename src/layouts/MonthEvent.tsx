import { useEffect, useState } from "react";

type Event = {
    id: number;
    titre: string;
    date_event: string;
    image?: string;
};

export default function MonthEvent() {
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("http://localhost:5000/events");
                const data = await response.json();
                console.log("Events fetched:", data);
                setEvents(data);
            } catch (error) {
                console.error("Erreur lors du chargement des événements :", error);
            }
        };

        fetchEvents();
    }, []);

    // On récupère l'événement 7ème dans la liste (slice(6,7))
    const eventDuMois = events.slice(6, 7);

    return (
        <section className="bg-gray-100 py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-semibold mb-4">Événement du moment</h2>

                {eventDuMois.map((event) => (
                    <div
                        key={event.id}
                        className="bg-white p-6 rounded-lg shadow-md"
                    >
                        <a href={`/events/${event.id}`}>
                            <h3 className="text-xl font-semibold mb-2">{event.titre}</h3>
                            <p className="text-gray-600 mb-4">
                                {new Date(event.date_event).toLocaleDateString("fr-FR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>

                            {event.image && (
                                <img
                                    src={`http://localhost:5000${event.image}`}
                                    alt={`Image de l'événement ${event.titre}`}
                                    className="rounded-lg shadow-md max-h-[450px] object-cover mb-4 w-full mx-auto"
                                />
                            )}
                        </a>
                    </div>
                ))}

                <a
                    href="/events"
                    className="inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition mt-6"
                >
                    Voir tous les événements
                </a>
            </div>
        </section>
    );
}
