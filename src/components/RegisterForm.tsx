import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        repeat_password: "",
        role_id: "2",
    });

    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    function handleChange(e: any) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        setErrors((prev: any) => ({ ...prev, [name]: "" })); // Efface l'erreur du champ modifié
    }

    function validateForm() {
        const newErrors: any = {};

        if (!formData.firstname.trim()) newErrors.firstname = "Le prénom est requis.";
        if (!formData.lastname.trim()) newErrors.lastname = "Le nom est requis.";
        if (!formData.email.trim()) newErrors.email = "L’email est requis.";

        // Regex mot de passe : 8+ caractères, majuscule, minuscule, chiffre, caractère spécial
        const pwdRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

        if (!pwdRegex.test(formData.password)) {
            newErrors.password =
                "Le mot de passe n'est pas assez sécurisé.";
        }

        if (formData.password !== formData.repeat_password) {
            newErrors.repeat_password = "Les mots de passe ne correspondent pas.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        setMessage("");

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                "https://ape-back-9jp6.onrender.com/auth/register",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || data.message);
            }

            setMessage("✅ Inscription réussie !");
            setFormData({
                firstname: "",
                lastname: "",
                email: "",
                password: "",
                repeat_password: "",
                role_id: "2",
            });

            window.location.href = "/login";
        } catch (err: any) {
            setMessage(`❌ ${err.message}`);
        }

        setLoading(false);
    }

    return (
        <section className="bg-slate-950 py-12 min-h-screen flex items-center justify-center mt-16">
            <form
                onSubmit={handleSubmit}
                className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg space-y-4"
            >
                <h2 className="text-2xl font-bold text-gray-800 text-center">
                    Inscription
                </h2>

                {/* Prénom */}
                <div>
                    <input
                        type="text"
                        name="firstname"
                        placeholder="Prénom"
                        value={formData.firstname}
                        onChange={handleChange}
                        className={`border p-3 w-full rounded focus:ring-2 ${errors.firstname
                            ? "border-red-500 focus:ring-red-400"
                            : "border-gray-300 focus:ring-blue-400"
                            }`}
                    />
                    {errors.firstname && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.firstname}
                        </p>
                    )}
                </div>

                {/* Nom */}
                <div>
                    <input
                        type="text"
                        name="lastname"
                        placeholder="Nom"
                        value={formData.lastname}
                        onChange={handleChange}
                        className={`border p-3 w-full rounded focus:ring-2 ${errors.lastname
                            ? "border-red-500 focus:ring-red-400"
                            : "border-gray-300 focus:ring-blue-400"
                            }`}
                    />
                    {errors.lastname && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.lastname}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`border p-3 w-full rounded focus:ring-2 ${errors.email
                            ? "border-red-500 focus:ring-red-400"
                            : "border-gray-300 focus:ring-blue-400"
                            }`}
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Mot de passe */}
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Mot de passe"
                        value={formData.password}
                        onChange={handleChange}
                        className={`border p-3 w-full rounded focus:ring-2 ${errors.password
                            ? "border-red-500 focus:ring-red-400"
                            : "border-gray-300 focus:ring-blue-400"
                            }`}
                    />

                    <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>

                    {errors.password && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Répéter le mot de passe */}
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="repeat_password"
                        placeholder="Répéter le mot de passe"
                        value={formData.repeat_password}
                        onChange={handleChange}
                        className={`border p-3 w-full rounded focus:ring-2 ${errors.repeat_password
                            ? "border-red-500 focus:ring-red-400"
                            : "border-gray-300 focus:ring-blue-400"
                            }`}
                    />

                    <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>

                    {errors.repeat_password && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.repeat_password}
                        </p>
                    )}
                </div>
                <span className="italic mx-auto md:flex md:flex-col md:mx-auto 2xl:w-xl 2xl:text-xl sm:w-sm lg:w-lg md:w-md "> <p > Le mot de passe doit contenir au moins 8 caractères et au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial parmi : !, @, #, $, %, ^, &, *. La sécurité avant tout ! </p> </span>

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
                    className="bg-blue-500 hover:bg-blue-600 text-white p-3 w-full rounded transition disabled:opacity-50"
                >
                    {loading ? "⏳ En cours..." : "S'inscrire"}
                </button>
            </form>
        </section>
    );
}
