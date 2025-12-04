import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Article = {
    id: number;
    titre: string;
    contenu_bref: string;
    image?: string;
};

export default function News() {
    const [articles, setArticles] = useState<Article[] | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch("https://ape-back-9jp6.onrender.com/articles");

                if (!response.ok) {
                    throw new Error("Erreur API " + response.status);
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    setArticles([]);
                } else {
                    setArticles(data);
                }

            } catch (error) {
                console.error("Erreur lors du chargement des articles :", error);
                setError(true);
                setArticles([]);
            }
        };

        fetchArticles();
    }, []);

    return (
        <section className="bg-slate-900 py-28 w-full">
            <div className="container mx-auto">
                <h2 className="text-4xl font-semibold mb-24 text-white text-center mx-4">
                    Dernières actualités
                </h2>

                {articles === null && (
                    <p className="text-center text-white">Chargement…</p>
                )}

                {error && (
                    <p className="text-center text-red-400">
                        Impossible de charger les actualités.
                    </p>
                )}

                {articles && articles.length === 0 && !error && (
                    <p className="text-center text-slate-300">
                        Aucun article disponible pour le moment.
                    </p>
                )}

                {articles && articles.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center transition mx-8">
                        {articles.slice(0, 3).map((article) => (
                            <Link
                                key={article.id}
                                to={`/news/${article.id}`}
                                className="w-full max-w-sm bg-slate-800 rounded-lg shadow p-6 text-white 
                                hover:scale-105 hover:bg-slate-700 hover:shadow-lg transition flex flex-col"
                            >
                                {/* IMAGE FIXE ET HARMONISÉE */}
                                {article.image && (
                                    <div className="w-full h-48 overflow-hidden rounded-lg mb-4">
                                        <img
                                            src={article.image}
                                            alt={`Image de l'article ${article.titre}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* CONTENU FLEX-GROW POUR ALIGNER LES CARTES */}
                                <div className="flex flex-col flex-grow">
                                    <h3 className="text-xl font-semibold mb-2 text-slate-100">
                                        {article.titre}
                                    </h3>

                                    <p className="text-slate-300 mb-4 flex-grow">
                                        {article.contenu_bref}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Link
                        to="/news"
                        className="inline-block border-2 border-blue-600 text-blue-600 px-5 py-2 mt-12 rounded-full 
                        hover:bg-blue-700 hover:text-white hover:border-white transition duration-300"
                    >
                        Voir plus d’actualités
                    </Link>
                </div>
            </div>
        </section>
    );
}
