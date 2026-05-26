import iziToast from "izitoast";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Result = {
    id: string | number;
    option: string;
    count: number;
};

type RawResult = {
    id?: string | number;
    option?: string;
    count?: number | string;
};

type PollResultsResponse = {
    title?: string;
    choices?: RawResult[];
    message?: string;
};

type PollTitleResponse = {
    title?: string;
    message?: string;
};


export default function Poll() {
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [pollTitle, setPollTitle] = useState("");
    const [selectedChoiceId, setSelectedChoiceId] = useState<string>("");
    const API_BASE = "https://ape-back-9jp6.onrender.com";
    const totalVotes = results.reduce((sum, result) => sum + result.count, 0);

    const getAuthHeaders = (): HeadersInit => {
        const token = localStorage.getItem("token");
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    const fetchPollTitle = async () => {
        try {
            const response = await fetch(`${API_BASE}/admin/votes`, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                return;
            }

            const data = (await response.json()) as PollResultsResponse | PollTitleResponse;

            if (typeof data === "object" && data && "title" in data && data.title) {
                setPollTitle(data.title);
            }
        } catch (error) {
            console.error("Erreur chargement titre sondage :", error);
        }
    };


    const fetchResults = async () => {
        try {
            const res = await fetch(`${API_BASE}/votes/results`, {
                cache: "no-store",
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Erreur backend :", text);
                return;
            }

            const data = (await res.json()) as RawResult[] | PollResultsResponse;
            const choices = Array.isArray(data) ? data : data.choices ?? [];

            if (!Array.isArray(data) && data.title) {
                setPollTitle(data.title);
            }

            if (!pollTitle) {
                await fetchPollTitle();
            }

            const normalized = choices.map((choice, index) => ({
                id: choice.id ?? `${choice.option ?? "choice"}-${index}`,
                option: choice.option ?? "Choix sans intitulé",
                count: Number(choice.count) || 0,
            }));

            const groupedResults = normalized.reduce<Result[]>((accumulator, choice) => {
                const groupKey = choice.option.trim();
                const existingChoice = accumulator.find((item) => item.option.trim() === groupKey);

                if (!existingChoice) {
                    accumulator.push({ ...choice });
                    return accumulator;
                }

                existingChoice.count += choice.count > 0 ? choice.count : 1;
                return accumulator;
            }, []);

            setResults(groupedResults);

            setSelectedChoiceId((currentChoiceId) => {
                if (groupedResults.length === 0) {
                    return "";
                }

                const stillExists = groupedResults.some((choice) => String(choice.id) === currentChoiceId);
                return stillExists ? currentChoiceId : String(groupedResults[0].id);
            });

        } catch (err) {
            console.error("Erreur réseau :", err);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    useEffect(() => {
        setIsAdmin(localStorage.getItem("role_id") === "1");
    }, []);

    const postVote = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const selectedChoice = results.find((choice) => String(choice.id) === selectedChoiceId);

        if (!selectedChoice) {
            iziToast.error({
                title: "Erreur",
                message: "Veuillez sélectionner une option",
                position: "topRight",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/votes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ option: selectedChoice.option }),
            });

            if (response.ok) {
                iziToast.success({
                    title: "Succès",
                    message: "Votre vote a été enregistré !",
                    position: "topRight",
                });

                await fetchResults();
            } else {
                const rawError = await response.text();
                let message = "Erreur côté serveur";

                if (rawError) {
                    try {
                        const parsed = JSON.parse(rawError) as { message?: string };
                        message = parsed.message ?? message;
                    } catch {
                        message = rawError;
                    }
                }

                console.error("Erreur backend :", response.status, message);
                iziToast.error({
                    title: "Erreur",
                    message: message,
                    position: "topRight",
                });
            }
        } catch (error) {
            console.error("Erreur envoi vote :", error);
            iziToast.error({
                title: "Erreur",
                message: "Une erreur est survenue lors de l'envoi de votre vote.",
                position: "topRight",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-slate-900 text-white py-16 mb-12 w-10/12 mx-auto rounded-xl shadow-lg border border-slate-800 mt-16">
            <div className="container mx-auto px-4">
                <div className="mb-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
                    <h2 className="text-4xl font-semibold m-auto">
                        Votre avis compte !
                    </h2>

                </div>
                <div>
                    {isAdmin && (
                        <Link
                            to="/backoffice/poll"
                            className="inline-flex items-center rounded-full border border-cyan-400/40 bg-cyan-400/10 px-5 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
                        >
                            Gérer le sondage
                        </Link>
                    )}
                </div>

                <form
                    onSubmit={postVote}
                    className="max-w-2xl mx-auto bg-slate-800/70 border border-slate-700 rounded-xl p-6 sm:p-8"
                >
                    <div className="mb-6">

                        <label className="block text-slate-200 text-sm font-semibold mb-3">
                            {pollTitle || "Chargement du titre du sondage..."}
                        </label>

                        <select
                            name="question"
                            value={selectedChoiceId}
                            onChange={(event) => setSelectedChoiceId(event.target.value)}
                            disabled={results.length === 0}
                            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-slate-100"
                        >
                            {results.length === 0 ? (
                                <option value="">Aucun choix disponible</option>
                            ) : (
                                results.map((r) => (
                                    <option key={r.id} value={String(r.id)}>
                                        {r.option}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            disabled={loading || results.length === 0}
                            className="rounded-full bg-blue-600 px-7 py-2.5 font-semibold hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Envoi..." : "Voter"}
                        </button>
                    </div>
                </form>


                <div className="mt-10">
                    <h3 className="text-xl font-semibold mb-4 text-center">
                        Résultats du sondage
                    </h3>

                    {results.length === 0 ? (
                        <p className="text-center text-slate-400">
                            Aucun choix ou vote pour le moment
                        </p>
                    ) : (
                        <div className="max-w-2xl mx-auto rounded-2xl border border-slate-700 bg-slate-800/70 p-5 sm:p-6">
                            <div className="mb-5 flex items-center justify-between rounded-xl bg-slate-900/70 px-4 py-3">
                                <span className="text-sm font-medium text-slate-300">Total des votes</span>
                                <span className="text-lg font-bold text-white">{totalVotes}</span>
                            </div>

                            <div className="space-y-4">
                                {results.map((r) => {
                                    const rawPercentage = totalVotes > 0 ? (r.count / totalVotes) * 100 : 0;
                                    const percentage = Math.max(0, Math.min(100, Math.round(rawPercentage)));

                                    return (
                                        <div key={String(r.id)} className="rounded-xl border border-slate-700 bg-slate-900/60 p-4">
                                            <div className="mb-2 flex items-baseline justify-between gap-4">
                                                <span className="text-sm font-semibold capitalize text-slate-100">
                                                    {r.option}
                                                </span>
                                                <span className="text-sm text-slate-300">
                                                    {r.count} vote{r.count > 1 ? "s" : ""} • {percentage}%
                                                </span>
                                            </div>

                                            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-700/70">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                    role="progressbar"
                                                    aria-valuenow={percentage}
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                    aria-label={`Progression pour ${r.option}`}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}