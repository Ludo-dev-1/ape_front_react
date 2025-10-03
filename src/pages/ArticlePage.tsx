import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ArticleActions from "../components/ArticlesActions";


type Article = {
    id: number;
    titre: string;
    contenu: string;
    date_publication: string;
    image?: string | null;
};

export default function ArticlePage() {
    const { id } = useParams<{ id: string }>(); // Récupère l'id depuis l'URL
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
                <div className="container mx-auto px-4 max-w-3xl flex flex-col items-center">
                    <h1 className="text-3xl font-bold mb-6">{article.titre}</h1>
                    <p className="text-gray-600 mb-2 text-sm">
                        Publié le{" "}
                        {new Date(article.date_publication).toLocaleDateString("fr-FR")}
                    </p>
                    <div className="mt-6 text-gray-800 leading-relaxed whitespace-pre-line">
                        {article.contenu}
                    </div>
                    {article.image && (
                        <div>
                            <img
                                src={`http://localhost:5000${article.image}`}
                                alt={`Image de ${article.titre}`}
                                className="mt-6 w-full h-auto rounded-lg shadow-md"
                            />
                        </div>
                    )}
                    <div className="mt-8">
                        <Link to="/news" className="text-blue-600 hover:underline">
                            ← Retour aux actualités
                        </Link>
                    </div>

                    {/* Boutons conditionnels */}
                    <ArticleActions articleId={article.id} />
                </div>
            </section>

        </>
    );
}
