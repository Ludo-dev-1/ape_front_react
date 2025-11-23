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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch("https://ape-back-9jp6.onrender.com/articles");

                if (!response.ok) {
                    throw new Error("Erreur API " + response.status);
                }

                const data = await response.json();

                // Vérification : data doit être un tableau
                if (!Array.isArray(data)) {
                    throw new Error("Format de données invalide");
                }

                setArticles(data);
            } catch (error: any) {
                console.error("Erreur lors du chargement des articles :", error);
                setError(error.message || "Une erreur est survenue");
            } finally {
                setLoading(false);
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

                {/* Loader */}
                {loading && (
                    <p className="text-center text-white text-lg">Chargement...</p>
                )}

                {/* Message d’erreur */}
                {error && (
                    <p className="text-center text-red-400 text-lg">
                        {error}
                    </p>
                )}

                {/* Aucun article */}
                {!loading && !error && articles.length === 0 && (
                    <p className="text-center text-slate-300 text-lg">
                        Aucun article disponible pour le moment.
                    </p>
                )}

                {/* Liste des articles */}
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center transition">
                    {articles.slice(0, 3).map((article) => (
                        <article
                            key={article.id}
                            className="bg-slate-800 p-6 rounded-lg shadow w-full text-white transition delay-50 duration-200 ease-in-out hover:scale-105 hover:bg-slate-700 hover:shadow-md max-w-sm"
                        >
                            <Link to={`/news/${article.id}`}>
                                <h3 className="text-xl font-semibold mb-2 text-slate-100">
                                    {article.titre}
                                </h3>

                                <p className="text-slate-300">
                                    {article.contenu_bref}
                                </p>

                                {article.image && (
                                    <img
                                        src={`https://ape-back-9jp6.onrender.com${article.image}`}
                                        alt={article.titre}
                                        className="rounded-lg shadow-md max-h-[200px] object-cover my-4 w-full mx-auto"
                                    />
                                )}
                            </Link>
                        </article>
                    ))}
                </div>

                <div className="mt-6 text-center">
                    <Link
                        to="/news"
                        className="inline-block border-2 border-blue-600 text-blue-600 px-5 py-2 mt-12 rounded-full hover:bg-blue-700 hover:text-white hover:border-white transition hover:ease-in-out duration-300"
                    >
                        Voir plus d’actualités
                    </Link>
                </div>
            </div>
        </section>
    );
}
