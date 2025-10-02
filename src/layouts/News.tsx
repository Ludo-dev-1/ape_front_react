import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Article = {
    id: number;
    titre: string;
    contenu_bref: string;
};

export default function News() {
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch("http://localhost:5000/articles");
                const data = await response.json();
                setArticles(data);
            } catch (error) {
                console.error("Erreur lors du chargement des articles :", error);
            }
        };

        fetchArticles();
    }, []);

    return (
        <section className="py-12 bg-gray-300">
            <div className="container mx-auto px-4">
                <h2 className="text-2xl font-semibold mb-6">Dernières actualités</h2>
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {articles.slice(0, 3).map((article) => (
                        <article
                            key={article.id}
                            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
                        >
                            <a href={`/news/${article.id}`}>
                                <h3 className="text-xl font-semibold mb-2">{article.titre}</h3>
                                <p>{article.contenu_bref}</p>
                            </a>
                        </article>
                    ))}
                </div>
                <div className="mt-6">
                    <Link
                        to="/news"
                        className="inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Voir plus d’actualités
                    </Link>
                </div>
            </div>
        </section>
    );
}
