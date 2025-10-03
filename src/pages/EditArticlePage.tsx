import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditArticleForm from "../components/EditArticleForm";

type Article = {
    id: number;
    titre: string;
    contenu_bref: string;
    contenu: string;
    image?: string | null;
};

export default function EditArticlePage() {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`http://localhost:5000/article/${id}`);
                const data = await response.json();
                setArticle(data);
            } catch (error) {
                console.error("Erreur lors du chargement de l'article :", error);
            }
        };

        if (id) fetchArticle();
    }, [id]);

    if (!article) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Chargement de l'article...</p>
            </div>
        );
    }

    return (
        <>

            <section className="bg-white py-12">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h1 className="text-2xl font-bold mb-6">Modifier l'article</h1>
                    <EditArticleForm
                        articleId={article.id.toString()}
                        initialTitre={article.titre}
                        initialContenuBref={article.contenu_bref}
                        initialContenu={article.contenu}
                        initialImage={article.image ?? ""}
                    />
                </div>
            </section>
        </>
    );
}
