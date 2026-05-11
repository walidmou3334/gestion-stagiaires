import React, { useEffect, useRef, useState } from "react";
import { getMesStages } from "../services/stageService";
import { deposerLivrable } from "../services/livrableService";

export default function DeposerLivrablePage() {
    const fileInputRef = useRef(null);

    const [stages, setStages] = useState([]);

    const [form, setForm] = useState({
        stageId: "",
        titre: "",
        description: "",
    });

    const [file, setFile] = useState(null);

    const [loadingStages, setLoadingStages] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/zip",
        "application/x-zip-compressed",
    ];

    const maxFileSize = 10 * 1024 * 1024;

    useEffect(() => {
        loadStages();
    }, []);

    const loadStages = async () => {
        try {
            setLoadingStages(true);
            setError("");

            const res = await getMesStages();
            setStages(res.data || []);
        } catch (err) {
            console.error(err);
            setError("Impossible de charger vos stages");
        } finally {
            setLoadingStages(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateFile = (selectedFile) => {
        if (!selectedFile) {
            return "Le fichier est obligatoire";
        }

        if (!allowedTypes.includes(selectedFile.type)) {
            return "Le fichier doit être au format PDF, DOC, DOCX ou ZIP";
        }

        if (selectedFile.size > maxFileSize) {
            return "La taille du fichier ne doit pas dépasser 10 Mo";
        }

        return "";
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        const validationError = validateFile(selectedFile);

        if (validationError) {
            setError(validationError);
            setFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            return;
        }

        setError("");
        setFile(selectedFile);
    };

    const resetForm = () => {
        setForm({
            stageId: "",
            titre: "",
            description: "",
        });

        setFile(null);
        setMessage("");
        setError("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!form.stageId) {
            setError("Veuillez choisir un stage");
            return;
        }

        if (!form.titre.trim()) {
            setError("Le titre est obligatoire");
            return;
        }

        const validationError = validateFile(file);

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoadingSubmit(true);

            const data = new FormData();
            data.append("stageId", form.stageId);
            data.append("titre", form.titre.trim());
            data.append("description", form.description.trim());
            data.append("file", file);

            await deposerLivrable(data);

            setMessage("Livrable déposé avec succès");

            setForm({
                stageId: "",
                titre: "",
                description: "",
            });

            setFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (err) {
            console.error(err);

            setError(err.response?.data?.message || "Erreur lors du dépôt");
        } finally {
            setLoadingSubmit(false);
        }
    };

    const formatFileSize = (size) => {
        if (!size) {
            return "";
        }

        return `${(size / 1024 / 1024).toFixed(2)} Mo`;
    };

    return (
        <div className="container-fluid py-4">
            <div className="row justify-content-center">
                <div className="col-xl-9 col-lg-10">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-header bg-white border-0 px-4 pt-4">
                            <div className="d-flex align-items-center gap-3">
                                <div
                                    className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
                                    style={{
                                        width: "56px",
                                        height: "56px",
                                        fontSize: "26px",
                                    }}
                                >
                                    <i className="bi bi-folder-plus"></i>
                                </div>

                                <div>
                                    <h3 className="fw-bold mb-1">Déposer un livrable</h3>
                                    <p className="text-muted mb-0">
                                        Envoyez votre rapport, code source ou document lié à votre
                                        stage.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card-body p-4">
                            {message && (
                                <div className="alert alert-success border-0 rounded-3">
                                    <i className="bi bi-check-circle me-2"></i>
                                    {message}
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger border-0 rounded-3">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {error}
                                </div>
                            )}

                            {loadingStages ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary"></div>
                                    <p className="text-muted mt-3 mb-0">
                                        Chargement de vos stages...
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">
                                            Stage <span className="text-danger">*</span>
                                        </label>

                                        <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-mortarboard"></i>
                      </span>

                                            <select
                                                name="stageId"
                                                className="form-select border-start-0"
                                                value={form.stageId}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">-- Choisir un stage --</option>

                                                {stages.map((s) => (
                                                    <option key={s.id} value={s.id}>
                                                        #{s.id} - {s.sujetFinal || "Sujet non défini"}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {stages.length === 0 && (
                                            <small className="text-danger">
                                                Aucun stage disponible pour déposer un livrable.
                                            </small>
                                        )}
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">
                                                Titre <span className="text-danger">*</span>
                                            </label>

                                            <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-type"></i>
                        </span>

                                                <input
                                                    name="titre"
                                                    className="form-control border-start-0"
                                                    value={form.titre}
                                                    onChange={handleChange}
                                                    placeholder="Ex: Rapport final"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-semibold">
                                                Fichier <span className="text-danger">*</span>
                                            </label>

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="form-control"
                                                accept=".pdf,.doc,.docx,.zip"
                                                onChange={handleFileChange}
                                                required
                                            />

                                            <small className="text-muted">
                                                Formats acceptés: PDF, DOC, DOCX, ZIP — max 10 Mo
                                            </small>

                                            {file && (
                                                <div className="mt-2 small text-success">
                                                    <i className="bi bi-file-earmark-check me-1"></i>
                                                    {file.name} ({formatFileSize(file.size)})
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            Description
                                        </label>

                                        <textarea
                                            name="description"
                                            className="form-control"
                                            rows="4"
                                            value={form.description}
                                            onChange={handleChange}
                                            placeholder="Ajoutez une description ou des remarques sur votre livrable..."
                                        ></textarea>
                                    </div>

                                    <div className="alert alert-info border-0 rounded-3">
                                        <i className="bi bi-info-circle me-2"></i>
                                        Après dépôt, votre livrable sera envoyé à l’encadrant ou au
                                        service RH pour validation.
                                    </div>

                                    <div className="d-flex justify-content-end gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={resetForm}
                                            disabled={loadingSubmit}
                                        >
                                            <i className="bi bi-arrow-counterclockwise me-1"></i>
                                            Réinitialiser
                                        </button>

                                        <button
                                            type="submit"
                                            className="btn btn-primary px-4"
                                            disabled={loadingSubmit || stages.length === 0}
                                        >
                                            {loadingSubmit ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Envoi...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-upload me-1"></i>
                                                    Déposer le livrable
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>

                    <p className="text-center text-muted small mt-4">
                        Vous pouvez déposer des fichiers PDF, Word ou ZIP selon le type de
                        livrable demandé.
                    </p>
                </div>
            </div>
        </div>
    );
}