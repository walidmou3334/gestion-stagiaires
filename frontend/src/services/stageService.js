import axios from "axios";

const RH_API = "/api/rh/stages";
const CANDIDAT_API = "/api/stages";

const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const affecterStage = (data) => {
    return axios.post(`${RH_API}/affecter`, data, {
        headers: authHeaders(),
    });
};

export const getAllStages = () => {
    return axios.get(RH_API, {
        headers: authHeaders(),
    });
};

export const terminerStage = (id) => {
    return axios.put(`${RH_API}/${id}/terminer`, {}, {
        headers: authHeaders(),
    });
};

export const annulerStage = (id) => {
    return axios.put(`${RH_API}/${id}/annuler`, {}, {
        headers: authHeaders(),
    });
};

export const getMesStages = () => {
    return axios.get(`${CANDIDAT_API}/me`, {
        headers: authHeaders(),
    });
};