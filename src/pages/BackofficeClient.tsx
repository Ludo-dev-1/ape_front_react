import React, { useEffect, useState } from "react";

type Role = { id: number; nom: string };
type Parent = { nom: string; email: string; roles: Role[] };

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

        fetch("http://localhost:5000/admin/backoffice", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error(`Erreur ${res.status}`);
                return res.json();
            })
            .then((data) => setParents(data))
            .catch((err) => setError(err.message));
    }, []);

    // Fonction pour modifier le rôle
    const handleEditRole = async (parentEmail: string, roleId: string) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return alert("Token non trouvé.");

            const res = await fetch(
                `http://localhost:5000/admin/backoffice/update-role/${parentEmail}`,
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

            // Recharge la page après la mise à jour
            window.location.reload();

            const data = await res.json();

            // Mettre à jour localement le rôle sans recharger la page
            setParents((prev) =>
                prev.map((p) =>
                    p.email === parentEmail
                        ? { ...p, roles: [{ id: data.parent.roles[0].id, nom: data.parent.roles[0].nom }] }
                        : p
                )
            );
        } catch (err: any) {
            alert("Erreur lors de la mise à jour: " + err.message);
        }
    };

    if (error) return <p>{error}</p>;
    if (!parents.length) return <p>Chargement...</p>;

    // Récupérer l'email de l'utilisateur connecté (par exemple depuis le localStorage)
    const currentUserEmail = localStorage.getItem("userEmail") || "";

    return (
        <table className="min-w-fit bg-white border m-auto mt-10">
            <thead>
                <tr>
                    <th className="py-2 px-4 border-b">Nom</th>
                    <th className="py-2 px-4 border-b">Email</th>
                    <th className="py-2 px-4 border-b">Rôle</th>
                    <th className="py-2 px-4 border-b">Modifier</th>
                </tr>
            </thead>
            <tbody>
                {parents
                    .filter((parent) => parent.email !== currentUserEmail) // Exclure l'utilisateur connecté
                    .map((parent) => (
                        <tr key={parent.email}>
                            <td className="py-2 px-4 border-b">{parent.nom}</td>
                            <td className="py-2 px-4 border-b">{parent.email}</td>
                            <td className="py-2 px-4 border-b">
                                {parent.roles.map((r) => r.nom).join(", ")}
                            </td>
                            <td className="py-2 px-4 border-b">
                                <select
                                    value={parent.roles[0]?.id || ""}
                                    onChange={(e) => handleEditRole(parent.email, e.target.value)}
                                    className="border rounded px-2 py-1"
                                >
                                    <option value="1">Admin</option>
                                    <option value="2">Parent</option>
                                    <option value="3">Membre_bureau</option>
                                    <option value="4">Membre_ape</option>
                                </select>

                            </td>
                        </tr>
                    ))}
            </tbody>

        </table>
    );
}
