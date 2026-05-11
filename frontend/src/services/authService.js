import axios from "axios";

const API_URL = "/api/auth";

export const registerUser = (data) => {
    return axios.post(`${API_URL}/register`, data);
};

export const loginUser = (data) => {
    return axios.post(`${API_URL}/login`, data);
};

export const getMyProfile = (token) => {
    return axios.get("/api/profile/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};