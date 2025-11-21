// src/lib/api.ts
import axios from "axios";

const api = axios.create({
    baseURL: "https://ape-back-9jp6.onrender.com", // <-- adapte si besoin
    // timeout: 10000
});

// ajouter token automatiquement (optionnel)
api.interceptors.request.use((cfg) => {
    const token = localStorage.getItem("token");
    if (token) cfg.headers && (cfg.headers['Authorization'] = `Bearer ${token}`);
    return cfg;
});

export default api;
