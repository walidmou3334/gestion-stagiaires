import axios from "axios";

const API = "/api/rh/encadrants";

const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
});

export const getEncadrants = () => {
    return axios.get(API, { headers: headers() });
};

export const createEncadrant = (data) => {
    return axios.post(API, data, { headers: headers() });
};

export const deleteEncadrant = (id) => {
    return axios.delete(`${API}/${id}`, { headers: headers() });
};