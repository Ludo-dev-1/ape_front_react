import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/AuthStore';


interface LoginFormProps {
    onLoginSuccess?: () => void; // Optionnel, callback après login réussi
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Fonction de connexion issue du store d'authentification
    const loadFromStorage = useAuthStore((state) => state.loadFromStorage);

    const login = useAuthStore((state) => state.login);


    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Exemple d'appel API vers backend pour login
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Erreur lors de la connexion');
            }

            // Si succès
            const data = await response.json();
            const token = data.token;
            login(token);
            if (onLoginSuccess) onLoginSuccess();
            // Sinon, tu peux rediriger ici ou gérer la suite
            window.location.href = "/"; // Redirection vers la page de connexion après l'inscription

        } catch (err: any) {
            setError(err.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-gray-100 py-12 min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg space-y-4">
                <h2 className="text-2xl font-bold mb-4 text-center">Connexion</h2>
                {error && (
                    <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">
                        {error}
                    </div>
                )}
                <div className="mb-4">
                    <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="exemple@domaine.com"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block mb-1 font-semibold">Mot de passe</label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Votre mot de passe"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 px-4 font-semibold rounded text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {loading ? 'Connexion...' : 'Se connecter'}
                </button>
            </form>
        </section>
    );
};
/* The login function is provided by the authStore, so this stub is not needed and has been removed. */

export default LoginForm;