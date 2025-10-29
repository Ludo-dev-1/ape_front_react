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
        <section className="bg-slate-900 py-28">
            <div className="container mx-auto  ">
                <h2 className="text-4xl font-semibold mb-24 text-white text-center">Dernières actualités</h2>
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 transition">
                    {articles.slice(0, 3).map((article) => (
                        <article
                            key={article.id}
                            className="bg-slate-800 p-6 rounded-lg shadow hover:shadow-md  text-white transition delay-50 duration-200 ease-in-out hover:scale-110 hover:bg-slate-700 hover:gap-7"
                        >
                            <a href={`/news/${article.id}`}>
                                <h3 className="text-xl font-semibold mb-2 text-slate-100">{article.titre}</h3>
                                <p className="text-slate-300">{article.contenu_bref}</p>
                            </a>
                        </article>
                    ))}
                </div>
                <div className="mt-6">
                    <Link
                        to="/news"
                        className="inline-block border-2 border-blue-600  text-blue-600 px-5 py-2 mt-12 rounded-full hover:bg-blue-700 hover:text-white hover:border-white transition"
                    >
                        Voir plus d’actualités
                    </Link>
                </div>
            </div>
        </section>
    );
}
