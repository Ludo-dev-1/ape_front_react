export default function Footer() {
    return (
        <footer className="bg-slate-800 text-white mt-12">
            <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="text-lg font-semibold mb-4">Navigation</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <a href="/" className="hover:underline">
                                Accueil
                            </a>
                        </li>
                        <li>
                            <a href="/news" className="hover:underline">
                                Actualités
                            </a>
                        </li>
                        <li>
                            <a href="/events" className="hover:underline">
                                Événements
                            </a>
                        </li>
                        <li>
                            <a href="/contact" className="hover:underline">
                                Contact
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4">Suivez-nous</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <a
                                href="https://www.facebook.com/profile.php?id=61567893013673"
                                className="hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Facebook
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.instagram.com/apejacquescharpentreau/"
                                className="hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Instagram
                            </a>
                        </li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4">Contactez-nous</h4>
                    <p className="text-sm">
                        Email:{" "}
                        <a
                            href="mailto:contact@apejacquescharpentreau.fr"
                            className="hover:underline"
                        >
                            contact@apejacquescharpentreau.fr
                        </a>
                    </p>
                </div>
                <div>
                    <h4 className="text-lg font-semibold mb-4">Politique de confidentialité</h4>
                    <p className="text-sm">
                        Consultez notre{" "}
                        <a
                            href="/privacy-policy"
                            className="hover:underline"
                        >
                            politique de confidentialité
                        </a>
                    </p>
                </div>
            </div>
            <div className="text-center text-sm py-4 bg-slate-800">
                © 2025 Association de Parents d'Élèves – Tous droits réservés.
            </div>
        </footer>
    );
}
