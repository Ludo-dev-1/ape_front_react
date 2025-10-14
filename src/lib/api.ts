// src/lib/api.ts
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000", // <-- adapte si besoin
    // timeout: 10000
});

// ajouter token automatiquement (optionnel)
api.interceptors.request.use((cfg) => {
    const token = localStorage.getItem("token");
    if (token) cfg.headers && (cfg.headers['Authorization'] = `Bearer ${token}`);
    return cfg;
});

export default api;
