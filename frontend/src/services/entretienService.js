import axios from "axios";

const RH_API = "/api/rh/entretiens";
const CANDIDAT_API = "/api/entretiens";

const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const planifierEntretien = (data) => {
    return axios.post(RH_API, data, {
        headers: authHeaders(),
    });
};

export const getAllEntretiens = () => {
    return axios.get(RH_API, {
        headers: authHeaders(),
    });
};

export const terminerEntretien = (id) => {
    return axios.put(`${RH_API}/${id}/terminer`, {}, {
        headers: authHeaders(),
    });
};

export const annulerEntretien = (id) => {
    return axios.put(`${RH_API}/${id}/annuler`, {}, {
        headers: authHeaders(),
    });
};

export const getMesEntretiens = () => {
    return axios.get(`${CANDIDAT_API}/me`, {
        headers: authHeaders(),
    });
};