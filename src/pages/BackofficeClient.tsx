import { useEffect, useState } from "react";
import iziToast from "izitoast";

type Role = { id: number; nom: string };
type Parent = { nom: string; email: string; roles: Role[]; userID: number };

export default function BackofficeClient() {
    const [parents, setParents] = useState<Parent[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Récupération des parents côté front
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Token non trouvé.");
            return;
        }

        fetch("http://localhost:3000/admin/backoffice", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error(`Erreur ${res.status}`);

                return res.json();

            })
            .then((data) => setParents(data))
            .catch((err) => setError(err.message));
    }, []);
    console.log(parents);

    // Fonction pour modifier le rôle
    const handleEditRole = async (parentEmail: string, roleId: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return alert("Token non trouvé.");

            const res = await fetch(
                `http://localhost:3000/admin/backoffice/update-role/${parentEmail}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ role_id: roleId }),
                }
            );

            if (!res.ok) throw new Error(`Erreur ${res.status}`);

            iziToast.success({
                title: "Succès",
                message: "Rôle mis à jour avec succès",
                position: "topRight",
                timeout: 1500 // optionnel : toast disparaît après 1.5 sec
            });
            // Recharge la page après la mise à jour
            setTimeout(() => {
                window.location.reload();
            }, 1500);

            const data = await res.json();

            // Mettre à jour localement le rôle sans recharger la page
            setParents((prev) =>
                prev.map((p) =>
                    p.email === parentEmail
                        ? {
                            ...p,
                            roles: [
                                { id: data.parent.roles[0].id, nom: data.parent.roles[0].nom },
                            ],
                        }
                        : p
                )
            );
        } catch (err: any) {
            alert("Erreur lors de la mise à jour: " + err.message);
            iziToast.error({
                title: "Erreur",
                message: "Erreur lors de la mise à jour: " + err.message,
                position: "topRight",
                timeout: 1500
            });
        }
    };

    const handleDeleteParent = async (parentEmail: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return alert("Token non trouvé.");

            const res = await fetch(
                `http://localhost:5000/admin/account/${parentEmail}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error(`Erreur ${res.status}`);

            iziToast.success({
                title: "Succès",
                message: "Utilisateur supprimé avec succès",
                position: "topRight",
                timeout: 1500 // optionnel : toast disparaît après 1.5 sec
            });

            // Recharge la page après 1.5 seconde
            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (err: any) {
            alert("Erreur lors de la suppression: " + err.message);
            iziToast.error({
                title: "Erreur",
                message: "Erreur lors de la suppression: " + err.message,
                position: "topRight",
                timeout: 1500
            });
        }
    };


    if (error) return <p>{error}</p>;
    if (!parents.length) return <p>Chargement...</p>;

    const currentUserEmail = localStorage.getItem("userEmail") || "";

    return (
        <div className="w-full px-2 sm:px-6 lg:px-8 pt-16">
            <h1 className="text-3xl md:text-4xl font-bold mt-20 text-center text-white">
                Gestion des utilisateurs
            </h1>

            {/* Conteneur scrollable pour la table */}
            <div className="overflow-x-auto mt-8 rounded-xl shadow-lg bg-gray-600 text-white">
                <table className="min-w-full border-collapse text-sm md:text-base">
                    <thead className="bg-gray-200 text-black">
                        <tr>
                            <th className="py-3 px-4 border-b text-left">Nom</th>
                            <th className="py-3 px-4 border-b text-left">Email</th>
                            <th className="py-3 px-4 border-b text-left">Rôle</th>
                            <th className="py-3 px-4 border-b text-left">Modifier</th>
                            <th className="py-3 px-4 border-b text-left">Supprimer</th>
                        </tr>
                    </thead>
                    <tbody >
                        {parents
                            .filter((parent) => parent.email !== currentUserEmail)
                            .map((parent) => (
                                <tr
                                    key={parent.email}
                                    className="border-b hover:bg-gray-300  hover:text-black transition-colors cursor-pointer"
                                >
                                    <td className="py-3 px-4 whitespace-nowrap">{parent.nom}</td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        {parent.email}
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        {parent.roles.map((r) => r.nom).join(", ")}
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <select
                                            value={parent.roles[0]?.id || ""}
                                            onChange={(e) =>
                                                handleEditRole(parent.email, e.target.value)
                                            }
                                            className="border rounded px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none text-black"
                                        >
                                            <option value="1">Admin</option>
                                            <option value="2">Parent</option>
                                            <option value="3">Membre_bureau</option>
                                            <option value="4">Membre_ape</option>
                                        </select>
                                    </td>
                                    <td>

                                        <button
                                            onClick={() => handleDeleteParent(parent.email)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 hover:scale-110 transition"
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
