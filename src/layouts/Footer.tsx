import { Link } from "react-router-dom";

const token = localStorage.getItem("token");

export default function Footer() {
    return (
        <footer className="bg-slate-800 text-white mt-12">
            <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="text-lg font-semibold mb-4">Navigation</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link to="/" className="hover:underline">
                                Accueil
                            </Link>
                        </li>
                        <li>
                            <Link to="/news" className="hover:underline">
                                Actualités
                            </Link>
                        </li>
                        <li>
                            <Link to="/events" className="hover:underline">
                                Événements
                            </Link>
                        </li>
                        {token && (
                            <li>
                                <Link to="/profile" className="hover:underline">Profil</Link>
                            </li>
                        )}
                        {!token && (
                            <>
                                <li>
                                    <Link to="/login" className="hover:underline">
                                        Connexion
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/register" className="hover:underline">
                                        Inscription
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4">Suivez-nous</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link
                                to="https://www.facebook.com/profile.php?id=61567893013673"
                                className="hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Facebook
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="https://www.instagram.com/apejacquescharpentreau/"
                                className="hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Instagram
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4">Contactez-nous</h4>
                    <p className="text-sm">
                        Email:{" "}
                        <Link
                            to="mailto:contact@apejacquescharpentreau.fr"
                            className="hover:underline"
                        >
                            contact@apejacquescharpentreau.fr
                        </Link >
                    </p>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4">Politique de confidentialité</h4>
                    <p className="text-sm">
                        Consultez notre{" "}
                        <Link
                            to="/privacy-policy"
                            className="hover:underline"
                        >
                            politique de confidentialité
                        </Link>
                    </p>
                </div>
            </div>
            <div className="text-center text-sm py-4 bg-slate-800">
                © 2025 Association de Parents d'Élèves – Tous droits réservés.
            </div>
        </footer>
    );
}
