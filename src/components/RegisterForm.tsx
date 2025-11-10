import { useState } from "react";

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        repeat_password: "",
        role_id: "2",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    function handleChange(e: { target: { name: any; value: any; }; }) {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Une erreur s'est produite");

            setMessage("✅ Inscription réussie !");
            setFormData({
                firstname: "",
                lastname: "",
                email: "",
                password: "",
                repeat_password: "",
                role_id: "2",
            });
            window.location.href = "/login"; // Redirection vers la page de connexion après l'inscription
        } catch (err) {
            if (err instanceof Error) {
                setMessage(`❌ ${err.message}`);
            } else {
                setMessage("❌ Une erreur s'est produite");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="bg-slate-950 py-12 min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg space-y-4"
            >
                <h2 className="text-2xl font-bold text-gray-800 text-center">
                    Inscription
                </h2>

                <input
                    type="text"
                    name="firstname"
                    placeholder="Prénom"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                    type="text"
                    name="lastname"
                    placeholder="Nom"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                    type="password"
                    name="repeat_password"
                    placeholder="Répéter le mot de passe"
                    value={formData.repeat_password}
                    onChange={handleChange}
                    required
                    className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input type="hidden" name="role_id" value="2" />

                {message && (
                    <div
                        className={`text-center p-2 rounded ${message.startsWith("✅")
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-3 w-full rounded transition duration-200 disabled:opacity-50"
                >
                    {loading ? "⏳ En cours..." : "S'inscrire"}
                </button>
            </form>
        </section>
    );
}
