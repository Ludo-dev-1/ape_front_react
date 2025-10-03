import { create } from "zustand";
import { jwtDecode } from "jwt-decode"; // attention à l'import par défaut, pas destructuré

interface DecodedToken {
    email: any;
    role_id: number;
    id: number;
}

interface IAuthState {
    token: string | null;
    isAdmin: boolean;
    isMember: boolean;
    isMemberBureau: boolean;
    isParent: boolean;
    userId: number | null;
    role_id: number | null; // ajout de role_id pour correspondre à la structure du token
    login: (token: string) => void;
    logout: () => void;
    loadFromStorage: () => void;  // nouvelle fonction pour charger depuis localStorage
}

export const useAuthStore = create<IAuthState>((set) => ({
    token: null,
    isAdmin: false,
    isMember: false,
    isMemberBureau: false,
    isParent: false,
    userId: null,
    role_id: null,
    userEmail: null,

    login: (token: string) => {
        localStorage.setItem("token", token);

        const decodedToken: DecodedToken = jwtDecode(token);
        const isAdmin = decodedToken.role_id === 1;
        const isParent = decodedToken.role_id === 2;
        const isMemberBureau = decodedToken.role_id === 3;
        const isMember = decodedToken.role_id === 4;
        const userId = decodedToken.id;
        const userEmail = decodedToken.email;

        localStorage.setItem("isAdmin", String(isAdmin));
        localStorage.setItem("isMemberBureau", String(isMemberBureau));
        localStorage.setItem("isMember", String(isMember));
        localStorage.setItem("isParent", String(isParent));
        localStorage.setItem("userId", String(userId));
        localStorage.setItem("userEmail", userEmail);
        localStorage.setItem("role_id", String(decodedToken.role_id));

        set({
            token,
            isAdmin,
            isParent,
            isMemberBureau,
            isMember: isParent || isMemberBureau || isMember, // booléen global
            userId
        });
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("isMember");
        localStorage.removeItem("isMemberBureau");
        localStorage.removeItem("isParent");
        localStorage.removeItem("userId");

        set({ token: null, isAdmin: false, userId: null, isMemberBureau: false, isParent: false });
    },

    loadFromStorage: () => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            const isAdmin = localStorage.getItem("isAdmin") === "true";
            const isMember = localStorage.getItem("isMember") === "true";
            const isMemberBureau = localStorage.getItem("isMemberBureau") === "true";
            const isParent = localStorage.getItem("isParent") === "true";

            const userIdStr = localStorage.getItem("userId");
            const userId = userIdStr ? Number(userIdStr) : null;

            set({ token, isAdmin, isMember, isMemberBureau, isParent, userId });
        }
    }
}));
