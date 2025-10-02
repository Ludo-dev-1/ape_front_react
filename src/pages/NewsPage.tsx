import { useEffect, useState } from "react";
import CreateArticleButton from "../components/CreateArticleButton";

type Article = {
    id: number;
    titre: string;
    contenu: string;
    image?: string;
};

export default function NewsPage() {
    const [articles, setArticles] = useState<Article[]>([]);

    const fetchArticles = async () => {
        try {
            const response = await fetch("http://localhost:5000/articles");
            const data = await response.json();
            setArticles(data);
        } catch (error) {
            console.error("Erreur lors du chargement des articles :", error);
        }
    };

    useEffect(() => {
        fetchArticles();

        // Simule le listener "article-created"
        const handleArticleCreated = () => {
            fetchArticles();
        };
        window.addEventListener("article-created", handleArticleCreated);

        return () => {
            window.removeEventListener("article-created", handleArticleCreated);
        };
    }, []);

    return (
        <>

            <section className="bg-gray-100 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold mb-6">Actualités</h1>
                    <p className="text-gray-700 mb-4">
                        Restez informés des dernières nouvelles de notre association et de la vie scolaire.
                    </p>

                    {/* Bouton de création d'article */}
                    <CreateArticleButton />

                    {/* Liste des articles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => (
                            <div key={article.id} className="bg-white p-6 rounded-lg shadow-md">
                                <a href={`/news/${article.id}`}>
                                    <h2 className="text-xl font-semibold mb-2">{article.titre}</h2>
                                    <p className="text-gray-600 mb-4 h-20 overflow-hidden">
                                        {article.contenu.slice(0, 100)}...
                                    </p>
                                    {article.image && (
                                        <div>
                                            <img
                                                src={`http://localhost:5000${article.image}`}
                                                alt={article.titre}
                                                className="w-full h-auto rounded max-h-48 object-cover"
                                            />
                                        </div>
                                    )}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
