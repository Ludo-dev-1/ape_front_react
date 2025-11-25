import { useEffect, useState } from "react";
import { Link } from "react-router";

type Event = {
    id: number;
    titre: string;
    date_event: string;
    image?: string;
};

export default function MonthEvent() {
    const [, setEvents] = useState<Event[]>([]);
    const [eventDuMois, setEventDuMois] = useState<Event | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch("https://ape-back-9jp6.onrender.com/events");
                const data = await response.json();

                console.log("Events fetched:", data);

                if (Array.isArray(data)) {
                    setEvents(data);

                    // ▼ Nouveau : sélection de l'événement le plus proche
                    const now = new Date();

                    const futureEvents = data
                        .filter(ev => new Date(ev.date_event) >= now)
                        .sort((a, b) => new Date(a.date_event).getTime() - new Date(b.date_event).getTime());

                    if (futureEvents.length > 0) {
                        setEventDuMois(futureEvents[0]); // Le plus proche
                    } else {
                        // Si aucun futur : on prend le dernier passé
                        const pastEvents = data
                            .filter(ev => new Date(ev.date_event) < now)
                            .sort((a, b) => new Date(b.date_event).getTime() - new Date(a.date_event).getTime());

                        setEventDuMois(pastEvents[0] || null);
                    }
                } else {
                    console.error("Les données reçues ne sont pas un tableau");
                }
            } catch (error) {
                console.error("Erreur lors du chargement des événements :", error);
            }
        };

        fetchEvents();
    }, []);

    return (
        <section className="w-10/12 mx-auto shadow-2xl py-12 mt-16 text-white ">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-semibold mb-4 text-center">Événement du moment</h2>

                {!eventDuMois && (
                    <p className="text-center text-gray-300">Aucun événement à afficher.</p>
                )}

                {eventDuMois && (
                    <div
                        key={eventDuMois.id}
                        className="bg-slate-800 m-12 p-12 rounded-lg shadow-md"
                    >
                        <Link to={`/events/${eventDuMois.id}`}>

                            <h3 className="text-xl font-semibold mb-2">{eventDuMois.titre}</h3>
                            <p className="text-gray-400 mb-4">
                                {new Date(eventDuMois.date_event).toLocaleDateString("fr-FR", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                            {eventDuMois.image && (
                                <img
                                    src={eventDuMois.image}
                                    alt={eventDuMois.titre}
                                    className="rounded-lg shadow-md max-h-[450px] object-cover mb-4 w-full mx-auto"
                                />
                            )}

                        </Link>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Link
                        to="/events"
                        className=" inline-block border-2 border-blue-600  text-blue-600 px-5 py-2 rounded-full hover:bg-blue-700 hover:text-white hover:border-white transition mt-6 hover:ease-in-out duration-300"
                    >
                        Voir tous les événements
                    </Link>
                </div>
            </div>
        </section>
    );
}
