// components/EventActions.tsx
import DeleteEventModal from "../modals/DeleteEventModal";

type Props = {
    eventId: number;
};

export default function EventActions({ eventId }: Props) {
    const role = typeof window !== "undefined" ? localStorage.getItem("role_id") : null;

    if (role !== "4" && role !== "1") return null; // pas membre bureau et pas admin=> pas de boutons

    return (
        <div className="mt-8 w-full flex justify-end gap-4">
            <a
                href={`/events/edit/${eventId}`}
                className="bg-yellow-500 text-white px-4 py-2 mb-4 rounded hover:bg-yellow-600"
            >
                Modifier
            </a>

            <DeleteEventModal
                eventId={eventId.toString()}
                onEventDeleted={() => window.dispatchEvent(new Event("event-deleted"))}
            />
        </div>
    );
}
