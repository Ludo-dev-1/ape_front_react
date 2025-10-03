// CreateArticleButton.tsx
import CreateArticleModal from "../modals/CreateArticleModal";

export default function CreateArticleButton() {
    const role = typeof window !== "undefined" ? localStorage.getItem("role_id") : null;

    if (role !== "3" && role !== "1") return null; // affichage conditionnel

    return (
        <CreateArticleModal onArticleCreated={() => window.dispatchEvent(new Event("article-created"))} />
    );
}
