import axios from "axios";

const API = "/api/dashboard";

const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getRhDashboard = () => {
    return axios.get(`${API}/rh`, {
        headers: authHeaders(),
    });
};

export const getCandidatDashboard = () => {
    return axios.get(`${API}/candidat`, {
        headers: authHeaders(),
    });
};

export const getEncadrantDashboard = () => {
    return axios.get(`${API}/encadrant`, {
        headers: authHeaders(),
    });
};