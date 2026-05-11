import axios from "axios";

const API_URL = "/api/candidatures";

const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ✅ إنشاء candidature
export const createCandidature = (formData) => {
    return axios.post(API_URL, formData, {
        headers: {
            ...authHeaders(),
            "Content-Type": "multipart/form-data",
        },
    });
};

// ✅ جلب candidatures
export const getMyCandidatures = () => {
    return axios.get(`${API_URL}/me`, {
        headers: authHeaders(),
    });
};

// ✅ تحميل CV
export const downloadCv = async (id) => {
    const response = await axios.get(`/api/candidatures/${id}/download-cv`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: "blob",
    });

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    let fileName = "cv.pdf";
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