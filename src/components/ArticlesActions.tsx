// components/ArticleActions.tsx
import DeleteArticleModal from "../modals/DeleteArticleModal";

type Props = {
    articleId: number;
};

export default function ArticleActions({ articleId }: Props) {
    const role = typeof window !== "undefined" ? localStorage.getItem("role_id") : null;

    if (role !== "3" && role !== "1") return null; // pas membre bureau => pas de boutons

    return (
        <div className="mt-8 w-full flex justify-end gap-4">
            <a
                href={`/news/edit/${articleId}`}
                className="bg-yellow-500 text-white px-4 py-2 mb-4 rounded hover:bg-yellow-600"
            >
                Modifier
            </a>

            <DeleteArticleModal
                articleId={articleId.toString()}
                onArticleDeleted={() => window.dispatchEvent(new Event("article-deleted"))}
            />
        </div>
    );
}
