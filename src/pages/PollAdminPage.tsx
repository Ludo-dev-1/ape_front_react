import { useEffect, useState } from "react";
import EditPoolForm from "../components/EditPoolForm";

type PollChoice = {
    id: string | number;
    option: string;
    count: number;
};

type RawPollChoice = {
    id?: string | number;
    option?: string;
    count?: number | string;
};

type PollAdminResponse = {
    title?: string;
    choices?: RawPollChoice[];
    message?: string;
};

export default function PollAdminPage() {
    const [pollTitle, setPollTitle] = useState("Votre avis compte !");
    const [choices, setChoices] = useState<PollChoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [readOnlyMode, setReadOnlyMode] = useState(false);

    const API_BASE = "/api";

    const getAuthHeaders = (): HeadersInit => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const extractErrorMessage = (rawError: string, fallback: string) => {
        if (!rawError) {
            return fallback;
        }

        try {
            const parsed = JSON.parse(rawError) as { message?: string };
            return parsed.message ?? fallback;
        } catch {
            return rawError;
        }
    };

    const loadPublicResultsFallback = async () => {
        const response = await fetch(`${API_BASE}/votes/results`);

        if (!response.ok) {
            const fallbackError = await response.text();
            throw new Error(extractErrorMessage(fallbackError, "Impossible de charger les résultats publics du sondage."));
        }

        const publicResults = (await response.json()) as RawPollChoice[];

        setChoices(
            publicResults.map((item, index) => ({
                id: item.id ?? `readonly-${index}`,
                option: item.option ?? "Choix sans intitulé",
                count: Number(item.count) || 0,
            }))
        );
    };

    const loadPoll = async () => {
        try {
            setLoading(true);
            setError(null);
            setReadOnlyMode(false);

            const response = await fetch(`${API_BASE}/admin/votes`, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const rawError = await response.text();

                const message = extractErrorMessage(rawError, "Impossible de charger le sondage.");

                if (message.includes("column \"title\" does not exist")) {
                    setReadOnlyMode(true);
                    setError(
                        "Le backend ne peut pas charger le titre du sondage car la colonne 'title' n'existe pas encore en base. Mode lecture seule activé."
                    );
                    await loadPublicResultsFallback();
                    return;
                }

                throw new Error(message);
            }

            const data = (await response.json()) as PollAdminResponse;

            if (data.title) {
                setPollTitle(data.title);
            }

            const resultsData = data.choices ?? [];

            setChoices(
                resultsData.map((item, index) => ({
                    id: item.id ?? item.option ?? index,
                    option: item.option ?? "Choix sans intitulé",
                    count: Number(item.count) || 0,
                }))
            );
        } catch (err) {
            console.error("Erreur chargement sondage admin :", err);
            setError(err instanceof Error ? err.message : "Impossible de charger le sondage.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPoll();
    }, []);

    const handleTitleSaved = async (newTitle: string) => {
        setPollTitle(newTitle);
    };

    const handleChoiceSaved = async () => {
        await loadPoll();
    };

    const handleChoiceDeleted = async () => {
        await loadPoll();
    };

    return (
        <section className="min-h-screen bg-slate-950 px-4 py-16 text-white">
            <div className="mx-auto w-full max-w-7xl pt-12">
                <div className="mb-10 text-center">
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Administration</p>
                    <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Gestion du sondage</h1>
                    <p className="mx-auto mt-4 max-w-3xl text-slate-300">
                        Modifiez le titre du sondage, ajustez les choix proposés et supprimez ceux qui ne sont plus pertinents.
                    </p>
                </div>

                {loading ? (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-8 text-center text-slate-300">
                        Chargement du sondage...
                    </div>
                ) : error && !readOnlyMode ? (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-200">
                        {error}
                    </div>
                ) : (
                    <>
                        {error && readOnlyMode && (
                            <div className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-amber-100">
                                {error}
                            </div>
                        )}

                        <div className="mb-8 rounded-3xl border border-slate-700 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 p-6 shadow-xl">
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Titre actuel</p>
                            <h2 className="mt-3 text-3xl font-semibold text-white">{pollTitle}</h2>
                            <p className="mt-2 text-sm text-slate-300">
                                Ce titre est affiché aux utilisateurs sur la page du sondage.
                            </p>
                        </div>

                        <div className="grid gap-6">
                            <EditPoolForm
                                pollTitle={pollTitle}
                                choice={{ id: "poll-title", option: pollTitle, count: choices.reduce((sum, item) => sum + item.count, 0) }}
                                onTitleSaved={handleTitleSaved}
                                showTitleEditor={!readOnlyMode}
                                showChoiceEditor={false}
                                showDeleteButton={false}
                                className="shadow-2xl"
                            />

                            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
                                <div className="mb-6 flex items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-2xl font-semibold">Choix du sondage</h3>
                                        <p className="mt-1 text-sm text-slate-400">
                                            {choices.length} choix disponible{choices.length > 1 ? "s" : ""}
                                        </p>
                                    </div>
                                </div>

                                {choices.length === 0 ? (
                                    <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-6 text-center text-slate-400">
                                        Aucun choix trouvé pour le moment.
                                    </div>
                                ) : (
                                    <div className="grid gap-6 lg:grid-cols-2">
                                        {choices.map((choice) => (
                                            <EditPoolForm
                                                key={choice.id}
                                                pollTitle={pollTitle}
                                                choice={choice}
                                                onSaved={handleChoiceSaved}
                                                onDeleted={handleChoiceDeleted}
                                                showTitleEditor={false}
                                                showChoiceEditor={!readOnlyMode}
                                                showDeleteButton={!readOnlyMode}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}