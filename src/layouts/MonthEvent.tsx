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
        <section className="w-10/12 mx-auto shadow-2xl py-12 mt-16 text-white ">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-semibold mb-4 text-center">Événement du moment</h2>

                {eventDuMois.map((event) => (
                    <div
                        key={event.id}
                        className="bg-slate-800 m-12 p-12 rounded-lg shadow-md"
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
                    className="inline-block border-2 border-blue-600  text-blue-600 px-5 py-2 rounded-full hover:bg-blue-700 hover:text-white hover:border-white transition mt-6"
                >
                    Voir tous les événements
                </a>
            </div>
        </section>
    );
}
