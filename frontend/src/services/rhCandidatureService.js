import axios from "axios";

const API_URL = "/api/rh/candidatures";

const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getAllRhCandidatures = () => {
    return axios.get(API_URL, {
        headers: authHeaders(),
    });
};

export const accepterCandidature = (id) => {
    return axios.put(`${API_URL}/${id}/accepter`, {}, {
        headers: authHeaders(),
    });
};

export const refuserCandidature = (id) => {
    return axios.put(`${API_URL}/${id}/refuser`, {}, {
        headers: authHeaders(),
    });
};