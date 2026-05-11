import axios from "axios";

const ENC_API = "/api/encadrant/evaluations";
const CANDIDAT_API = "/api/evaluations";
const RH_API = "/api/rh/evaluations";

const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const creerEvaluation = (data) => {
    return axios.post(ENC_API, data, {
        headers: authHeaders(),
    });
};

export const getEvaluationsEncadrant = () => {
    return axios.get(ENC_API, {
        headers: authHeaders(),
    });
};

export const getMesEvaluations = () => {
    return axios.get(`${CANDIDAT_API}/me`, {
        headers: authHeaders(),
    });
};

export const getAllEvaluationsRh = () => {
    return axios.get(RH_API, {
        headers: authHeaders(),
    });
};