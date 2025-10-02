import React, { useEffect, useState } from "react";
import apeLogo from "../assets/apeLogo.jpg";
import { Link } from "react-router";

type User = {
    role: string | null;
};

export default function Header() {
    const [user, setUser] = useState<User>({ role: null });
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const role = localStorage.getItem("role_id");
        setUser({ role });
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/">
                    <img src={apeLogo} alt="Logo Association" className="w-12 h-12" />
                </Link>

                {/* Menu burger mobile */}
                <div className="md:hidden">
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        <svg
                            className="w-6 h-6 text-gray-800"
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
                </div>

                {/* Navigation desktop */}
                <nav className="hidden md:block">
                    <ul className="flex space-x-6 text-sm font-medium">
                        <li><Link to="/" className="hover:text-blue-600">Accueil</Link></li>
                        <li><Link to="/news" className="hover:text-blue-600">Actualités</Link></li>
                        <li><Link to="/events" className="hover:text-blue-600">Événements</Link></li>
                        <li><Link to="/contact" className="hover:text-blue-600">Contact</Link></li>
                        {user.role ? (
                            <>
                                <li><Link to="/boutique" className="hover:text-blue-600">Boutique</Link></li>
                                <li><Link to="/panier" className="hover:text-blue-600">Panier</Link></li>
                                <li><Link to="/profile" className="hover:text-blue-600">Mon Profil</Link></li>
                                {user.role === "1" && (
                                    <li><Link to="/backoffice" className="hover:text-blue-600">Back-Office</Link></li>
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
                                <li><Link to="/register" className="hover:text-blue-600">Inscription</Link></li>
                                <li><Link to="/login" className="hover:text-blue-600">Connexion</Link></li>
                            </>
                        )}
                    </ul>
                </nav>

                {/* Menu mobile */}
                {menuOpen && (
                    <div className="md:hidden px-4 pb-4">
                        <ul className="flex flex-col space-y-2 text-sm font-medium">
                            <li><Link to="/" className="block hover:text-blue-600">Accueil</Link></li>
                            <li><Link to="/news" className="block hover:text-blue-600">Actualités</Link></li>
                            <li><Link to="/events" className="block hover:text-blue-600">Événements</Link></li>
                            <li><Link to="/contact" className="block hover:text-blue-600">Contact</Link></li>
                            {user.role ? (
                                <>
                                    <li><Link to="/boutique" className="block hover:text-blue-600">Boutique</Link></li>
                                    <li><Link to="/panier" className="block hover:text-blue-600">Panier</Link></li>
                                    <li><Link to="/profile" className="block hover:text-blue-600">Mon Profil</Link></li>
                                    {user.role === "1" && (
                                        <li><Link to="/backoffice" className="block hover:text-blue-600">Back-Office</Link></li>
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
                                    <li><Link to="/register" className="block hover:text-blue-600">Inscription</Link></li>
                                    <li><Link to="/login" className="block hover:text-blue-600">Connexion</Link></li>
                                </>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
}
