import React, { useEffect, useState } from "react";
import apeLogo from "../assets/apeLogo.jpg";
import { Link, useLocation } from "react-router";

type User = {
    role: string | null;
};

export default function Header() {
    const [user, setUser] = useState<User>({ role: null });
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    // Fermer le menu mobile lors d’un changement de page
    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    // Récupération du rôle utilisateur depuis le localStorage
    useEffect(() => {
        const role = localStorage.getItem("role_id");
        setUser({ role });
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    const isActive = (path: string) =>
        location.pathname === path ? "text-blue-600" : "hover:text-blue-600";

    return (
        <header className="bg-slate-950 text-white shadow-lg fixed w-full top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <img src={apeLogo} alt="Logo Association" className="w-12 h-12" />
                </Link>

                {/* Bouton menu mobile */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden focus:outline-none"
                    aria-label="Ouvrir le menu"
                >
                    <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>

                {/* Navigation principale */}
                <nav
                    className={`${menuOpen
                            ? "absolute top-20 left-0 w-full bg-slate-900 flex flex-col items-center py-4 space-y-4 md:space-y-0 md:py-0 md:flex md:flex-row md:justify-end md:bg-transparent"
                            : "hidden md:flex md:flex-row md:justify-end"
                        } text-lg font-medium`}
                >
                    <ul className="flex flex-col md:flex-row md:space-x-6 text-center">
                        <li>
                            <Link to="/" className={isActive("/")}>
                                Accueil
                            </Link>
                        </li>
                        <li>
                            <Link to="/news" className={isActive("/news")}>
                                Actualités
                            </Link>
                        </li>
                        <li>
                            <Link to="/events" className={isActive("/events")}>
                                Événements
                            </Link>
                        </li>

                        {user.role ? (
                            <>
                                <li>
                                    <Link to="/boutique" className={isActive("/boutique")}>
                                        Boutique
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/panier" className={isActive("/panier")}>
                                        Panier
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/profile" className={isActive("/profile")}>
                                        Mon Profil
                                    </Link>
                                </li>
                                {user.role === "1" && (
                                    <li>
                                        <Link to="/backoffice" className={isActive("/backoffice")}>
                                            Back-Office
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="hover:text-blue-600 cursor-pointer"
                                    >
                                        Déconnexion
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/register" className={isActive("/register")}>
                                        Inscription
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/login" className={isActive("/login")}>
                                        Connexion
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
