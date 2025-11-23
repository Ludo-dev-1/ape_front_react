import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Article = {
    id: number;
    titre: string;
    contenu_bref: string;
    image?: string;
};

export default function News() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch("https://ape-back-9jp6.onrender.com/articles");

                if (!response.ok) {
                    throw new Error("Erreur API " + response.status);
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Format de données invalide");
                }

                setArticles(data);
            } catch (error: any) {
                console.error("Erreur lors du chargement des articles :", error);
                setError(error.message);
            }
        };

        fetchArticles();
    }, []);

    return (
        <section className="bg-slate-900 py-28 w-full">
            <div className="container mx-auto">
                <h2 className="text-4xl font-semibold mb-24 text-white text-center">
                    Dernières actualités
                </h2>

                {error && (
                    <p className="text-red-500 text-center mb-6">
                        Impossible de charger les articles.
                    </p>
                )}

                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
                    {articles.length === 0 && !error && (
                        <p className="text-slate-300">Aucun article disponible.</p>
                    )}

                    {articles.slice(0, 3).map((article) => (
                        <article
                            key={article.id}
                            className="bg-slate-800 p-6 rounded-lg shadow w-full text-white hover:scale-105 hover:bg-slate-700 transition max-w-sm"
                        >
                            <Link to={`/news/${article.id}`}>
                                <h3 className="text-xl font-semibold mb-2">
                                    {article.titre}
                                </h3>
                                <p className="text-slate-300">{article.contenu_bref}</p>

                                {article.image && (
                                    <img
                                        src={article.image
                                            ? `${import.meta.env.VITE_API_URL}/uploads/${article.image}`
                                            : "/placeholder.jpg"}
                                        alt=""
                                    />

                                )}
                            </Link>
                        </article>
                    ))}
                </div>

                <div className="mt-6 text-center">
                    <Link
                        to="/news"
                        className="inline-block border-2 border-blue-600 text-blue-600 px-5 py-2 mt-12 rounded-full hover:bg-blue-700 hover:text-white transition"
                    >
                        Voir plus d’actualités
                    </Link>
                </div>
            </div>
        </section>
    );
}
