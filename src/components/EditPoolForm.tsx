import { useEffect, useState } from "react";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

type PollChoice = {
    id: string | number;
    option: string;
    count?: number;
};

interface EditPoolFormProps {
    pollTitle: string;
    choice?: PollChoice;
    apiBase?: string;
    titleEndpoint?: string;
    updateEndpoint?: string;
    deleteEndpoint?: string;
    onTitleSaved?: (newTitle: string) => void | Promise<void>;
    onSaved?: (updatedChoice: PollChoice) => void | Promise<void>;
    onDeleted?: (choiceId: PollChoice["id"]) => void | Promise<void>;
    showTitleEditor?: boolean;
    showChoiceEditor?: boolean;
    showDeleteButton?: boolean;
    className?: string;
}

export default function EditPoolForm({
    pollTitle,
    choice,
    apiBase = "/api",
    titleEndpoint,
    updateEndpoint,
    deleteEndpoint,
    onTitleSaved,
    onSaved,
    onDeleted,
    showTitleEditor = true,
    showChoiceEditor = true,
    showDeleteButton = true,
    className = "",
}: EditPoolFormProps) {
    const [title, setTitle] = useState(pollTitle);
    const [option, setOption] = useState(choice?.option ?? "");
    const [loading, setLoading] = useState<"save" | "delete" | null>(null);

    useEffect(() => {
        setTitle(pollTitle);
    }, [pollTitle]);

    useEffect(() => {
        setOption(choice?.option ?? "");
    }, [choice?.option]);

    const getTitleUrl = () => titleEndpoint ?? `${apiBase}/admin/votes/title`;
    const getUpdateUrl = () => updateEndpoint ?? `${apiBase}/admin/votes/${choice?.id ?? ""}`;
    const getDeleteUrl = () => deleteEndpoint ?? `${apiBase}/admin/votes/${choice?.id ?? ""}`;

    const getAuthHeaders = (withJson = true): HeadersInit => {
        const token = localStorage.getItem("token");

        return {
            ...(withJson ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    };

    const extractErrorMessage = async (response: Response, fallback: string) => {
        const raw = await response.text();

        if (!raw) {
            return fallback;
        }

        try {
            const parsed = JSON.parse(raw) as { message?: string };
            return parsed.message ?? fallback;
        } catch {
            return raw;
        }
    };

    const handleTitleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            iziToast.error({
                title: "Erreur",
                message: "Le titre du sondage ne peut pas être vide.",
                position: "topRight",
            });
            return;
        }

        if (!localStorage.getItem("token")) {
            iziToast.error({
                title: "Erreur",
                message: "Vous devez être connecté en admin pour modifier le sondage.",
                position: "topRight",
            });
            return;
        }

        setLoading("save");

        try {
            const response = await fetch(getTitleUrl(), {
                method: "PUT",
                headers: getAuthHeaders(true),
                body: JSON.stringify({ title: trimmedTitle }),
            });

            if (!response.ok) {
                const message = await extractErrorMessage(response, "Erreur lors de la modification du titre.");
                throw new Error(message);
            }

            iziToast.success({
                title: "Succès",
                message: "Le titre du sondage a été modifié.",
                position: "topRight",
            });

            await onTitleSaved?.(trimmedTitle);
        } catch (error) {
            console.error("Erreur modification titre du sondage :", error);
            iziToast.error({
                title: "Erreur",
                message: error instanceof Error ? error.message : "Impossible de modifier le titre.",
                position: "topRight",
            });
        } finally {
            setLoading(null);
        }
    };

    const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedOption = option.trim();

        if (!trimmedOption) {
            iziToast.error({
                title: "Erreur",
                message: "Le choix de vote ne peut pas être vide.",
                position: "topRight",
            });
            return;
        }

        if (!localStorage.getItem("token")) {
            iziToast.error({
                title: "Erreur",
                message: "Vous devez être connecté en admin pour modifier un choix.",
                position: "topRight",
            });
            return;
        }

        setLoading("save");

        try {
            const response = await fetch(getUpdateUrl(), {
                method: "PUT",
                headers: getAuthHeaders(true),
                body: JSON.stringify({ option: trimmedOption }),
            });

            if (!response.ok) {
                const message = await extractErrorMessage(response, "Erreur lors de la modification du choix.");
                throw new Error(message);
            }

            const updatedChoice = choice
                ? {
                    ...choice,
                    option: trimmedOption,
                }
                : { id: "", option: trimmedOption, count: 0 };

            iziToast.success({
                title: "Succès",
                message: "Le choix a été modifié.",
                position: "topRight",
            });

            await onSaved?.(updatedChoice);
        } catch (error) {
            console.error("Erreur modification choix de vote :", error);

            if (!choice) {
                return;
            }

            iziToast.error({
                title: "Erreur",
                message: error instanceof Error ? error.message : "Impossible de modifier le choix.",
                position: "topRight",
            });
        } finally {
            setLoading(null);
        }
    };

    const handleDelete = async () => {
        if (!choice) {
            return;
        }

        const confirmed = window.confirm("Supprimer ce choix de vote ? Cette action est irréversible.");

        if (!confirmed) {
            return;
        }

        if (!localStorage.getItem("token")) {
            iziToast.error({
                title: "Erreur",
                message: "Vous devez être connecté en admin pour supprimer un choix.",
                position: "topRight",
            });
            return;
        }

        setLoading("delete");

        try {
            const response = await fetch(getDeleteUrl(), {
                method: "DELETE",
                headers: getAuthHeaders(false),
            });

            if (!response.ok) {
                const message = await extractErrorMessage(response, "Erreur lors de la suppression du choix.");
                throw new Error(message);
            }

            iziToast.success({
                title: "Succès",
                message: "Le choix a été supprimé.",
                position: "topRight",
            });

            await onDeleted?.(choice.id);
        } catch (error) {
            console.error("Erreur suppression choix de vote :", error);
            iziToast.error({
                title: "Erreur",
                message: error instanceof Error ? error.message : "Impossible de supprimer le choix.",
                position: "topRight",
            });
        } finally {
            setLoading(null);
        }
    };

    return (
        <section
            className={`mx-auto w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-900/90 p-5 text-white shadow-lg ${className}`}
        >
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Sondage</p>
                    <h2 className="mt-2 text-2xl font-bold">Modifier le sondage</h2>
                </div>

                {typeof choice?.count === "number" && (
                    <div className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-right">
                        <p className="text-xs text-slate-400">Votes actuels</p>
                        <p className="text-lg font-semibold text-white">{choice.count}</p>
                    </div>
                )}
            </div>

            {showTitleEditor && (
                <form onSubmit={handleTitleUpdate} className="mb-8 space-y-5 rounded-2xl border border-slate-700 bg-slate-950/60 p-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-200">
                            Titre du sondage
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex. Votre avis compte !"
                            className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading !== null}
                        className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading === "save" ? "Enregistrement..." : "Modifier le titre"}
                    </button>
                </form>
            )}

            {showChoiceEditor && choice && (
                <form onSubmit={handleUpdate} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-200">
                            Libellé du choix
                        </label>
                        <input
                            type="text"
                            value={option}
                            onChange={(e) => setOption(e.target.value)}
                            placeholder="Ex. Atelier de peinture"
                            className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                        />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="submit"
                            disabled={loading !== null}
                            className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading === "save" ? "Enregistrement..." : "Modifier le choix"}
                        </button>

                        {showDeleteButton && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={loading !== null}
                                className="inline-flex items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 px-6 py-3 font-semibold text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading === "delete" ? "Suppression..." : "Supprimer le choix"}
                            </button>
                        )}
                    </div>
                </form>
            )}
        </section>
    );
}
