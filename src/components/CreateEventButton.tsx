// CreateEventButton.tsx
import CreateEventModal from "../modals/CreateEventModal";

export default function CreateEventButton() {
    const role = typeof window !== "undefined" ? localStorage.getItem("role_id") : null;

    if (role !== "3" && role !== "1") return null; // affichage conditionnel

    return (
        <CreateEventModal onEventCreated={() => window.dispatchEvent(new Event("event-created"))} />
    );
}
