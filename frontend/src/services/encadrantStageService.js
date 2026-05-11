import axios from "axios";

const API = "/api/encadrant/stages";

const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getStagesEncadrant = () => {
    return axios.get(API, {
        headers: authHeaders(),
    });
};