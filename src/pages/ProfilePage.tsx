import React, { useEffect, useState } from "react";

type User = {
    prenom: string;
    nom: string;
    email: string;
    role_id: string;
};

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Password form state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changing, setChanging] = useState(false);
    const [changeMessage, setChangeMessage] = useState<string | null>(null);

    useEffect(() => {
        async function loadUser() {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Token non trouvé");

                const res = await fetch("https://ape-back-9jp6.onrender.com/auth/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!res.ok) throw new Error(`Erreur ${res.status}`);

                const data = await res.json();
                setUser({
                    prenom: data.prenom ?? data.first_name ?? data.firstname ?? "",
                    nom: data.nom ?? data.last_name ?? data.lastname ?? "",
                    email: data.email ?? "",
                    role_id: data.role ?? data.roles ?? "",
                });
            } catch (err: any) {
                setError("Impossible de charger le profil.");
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    }, []);

    function validatePassword(): string | null {
        if (!currentPassword) return "Veuillez saisir votre mot de passe actuel.";
        if (newPassword.length < 8)
            return "Le nouveau mot de passe doit contenir au moins 8 caractères.";
        if (newPassword !== confirmPassword)
            return "Les mots de passe ne correspondent pas.";
        return null;
    }

    async function handleChangePassword(e: React.FormEvent) {
        e.preventDefault();
        setChangeMessage(null);
        const validation = validatePassword();
        if (validation) {
            setChangeMessage(validation);
            return;
        }
        setChanging(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch("http://localhost:3000/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
                body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
            });

            if (res.ok) {
                setChangeMessage("✅ Mot de passe mis à jour avec succès.");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else if (res.status === 401 || res.status === 400) {
                const body = await res.json().catch(() => ({}));
                setChangeMessage(body.message ?? "Mot de passe actuel incorrect.");
            } else {
                setChangeMessage("Erreur lors de la modification du mot de passe.");
            }
        } catch {
            setChangeMessage("Erreur réseau.");
        } finally {
            setChanging(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto mt-20 px-6 py-10 text-white">
            <h1 className="text-4xl font-bold text-center mb-8">Mon profil</h1>

            {loading && <p className="text-center text-gray-300">Chargement...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && user && (
                <section className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-8 shadow-md">
                    <h2 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-2">
                        Informations personnelles
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Prénom</label>
                            <div className="bg-slate-800 px-3 py-2 rounded-md text-gray-100">
                                {user.prenom}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Nom</label>
                            <div className="bg-slate-800 px-3 py-2 rounded-md text-gray-100">
                                {user.nom}
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-400 mb-1">Email</label>
                            <div className="bg-slate-800 px-3 py-2 rounded-md text-gray-100">
                                {user.email}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Rôle</label>
                            <div className="bg-slate-800 px-3 py-2 rounded-md text-gray-100 capitalize">
                                {user.role_id}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Formulaire de changement de mot de passe */}
            <section className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-md">
                <h2 className="text-2xl font-semibold mb-6 border-b border-slate-700 pb-2">
                    Modifier le mot de passe
                </h2>

                <form onSubmit={handleChangePassword} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Mot de passe actuel
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoComplete="current-password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Nouveau mot de passe
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoComplete="new-password"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Minimum 8 caractères
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Confirmer le nouveau mot de passe
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoComplete="new-password"
                        />
                    </div>

                    {changeMessage && (
                        <p
                            className={`text-sm ${changeMessage.includes("succès")
                                ? "text-green-400"
                                : "text-red-400"
                                }`}
                        >
                            {changeMessage}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={changing}
                        className={`w-full md:w-auto px-6 py-2 rounded-md text-white font-medium transition ${changing
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                            }`}
                    >
                        {changing ? "En cours..." : "Mettre à jour le mot de passe"}
                    </button>
                </form>
            </section>
        </div>
    );
}
