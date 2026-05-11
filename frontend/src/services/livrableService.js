import axios from "axios";

const API = "/api/livrables";
const RH_API = "/api/rh/livrables";
const ENC_API = "/api/encadrant/livrables";

const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const deposerLivrable = (formData) => {
    return axios.post(API, formData, {
        headers: {
            ...authHeaders(),
            "Content-Type": "multipart/form-data",
        },
    });
};

export const getMesLivrables = () => {
    return axios.get(`${API}/me`, {
        headers: authHeaders(),
    });
};

export const downloadLivrable = async (id) => {
    const response = await axios.get(`${API}/${id}/download`, {
        headers: authHeaders(),
        responseType: "blob",
    });

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    let fileName = "livrable.pdf";
    const disposition = response.headers["content-disposition"];

    if (disposition) {
        const match = disposition.match(/filename="(.+)"/);
        if (match && match[1]) {
            fileName = match[1];
        }
    }

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
};

export const getAllLivrablesRh = () => {
    return axios.get(RH_API, {
        headers: authHeaders(),
    });
};

export const validerLivrableRh = (id, remarque) => {
    return axios.put(`${RH_API}/${id}/valider`, { remarque }, {
        headers: authHeaders(),
    });
};

export const rejeterLivrableRh = (id, remarque) => {
    return axios.put(`${RH_API}/${id}/rejeter`, { remarque }, {
        headers: authHeaders(),
    });
};

export const getLivrablesEncadrant = () => {
    return axios.get(ENC_API, {
        headers: authHeaders(),
    });
};

export const validerLivrableEncadrant = (id, remarque) => {
    return axios.put(`${ENC_API}/${id}/valider`, { remarque }, {
        headers: authHeaders(),
    });
};

export const rejeterLivrableEncadrant = (id, remarque) => {
    return axios.put(`${ENC_API}/${id}/rejeter`, { remarque }, {
        headers: authHeaders(),
    });
};