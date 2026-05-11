import React, { useRef, useState } from "react";
import { createCandidature } from "../services/candidatureService";

export default function CandidaturePage() {
    const cvInputRef = useRef(null);
    const autreInputRef = useRef(null);

    const [data, setData] = useState({
        domaineStage: "",
        sujetPropose: "",
    });

    const [cv, setCv] = useState(null);
    const [autre, setAutre] = useState(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const maxFileSize = 5 * 1024 * 1024;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateFile = (file, required = false) => {
        if (!file && required) {
            return "Le CV est obligatoire";
        }

        if (!file) {
            return "";
        }

        if (!allowedTypes.includes(file.type)) {
            return "Le fichier doit être au format PDF, DOC ou DOCX";
        }

        if (file.size > maxFileSize) {
            return "La taille du fichier ne doit pas dépasser 5 Mo";
        }

        return "";
    };

    const handleCvChange = (e) => {
        const file = e.target.files[0];

        const validationError = validateFile(file, true);

        if (validationError) {
            setError(validationError);
            setCv(null);

            if (cvInputRef.current) {
                cvInputRef.current.value = "";
            }

            return;
        }

        setError("");
        setCv(file);
    };

    const handleAutreChange = (e) => {
        const file = e.target.files[0];

        const validationError = validateFile(file, false);

        if (validationError) {
            setError(validationError);
            setAutre(null);

            if (autreInputRef.current) {
                autreInputRef.current.value = "";
            }

            return;
        }

        setError("");
        setAutre(file || null);
    };

    const resetForm = () => {
        setData({
            domaineStage: "",
            sujetPropose: "",
        });

        setCv(null);
        setAutre(null);
        setError("");
        setMessage("");

        if (cvInputRef.current) {
            cvInputRef.current.value = "";
        }

        if (autreInputRef.current) {
            autreInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!data.domaineStage.trim()) {
            setError("Le domaine de stage est obligatoire");
            return;
        }

        if (!data.sujetPropose.trim()) {
            setError("Le sujet proposé est obligatoire");
            return;
        }

        const cvError = validateFile(cv, true);

        if (cvError) {
            setError(cvError);
            return;
        }

        try {
            setLoading(true);

            const form = new FormData();
            form.append("domaineStage", data.domaineStage.trim());
            form.append("sujetPropose", data.sujetPropose.trim());
            form.append("cvFile", cv);

            if (autre) {
                form.append("autresFile", autre);
            }

            await createCandidature(form);

            setMessage("Candidature envoyée avec succès");
            resetForm();
            setMessage("Candidature envoyée avec succès");
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || "Erreur lors de l'envoi de la candidature"
            );
        } finally {
            setLoading(false);
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
                                    <i className="bi bi-send"></i>
                                </div>

                                <div>
                                    <h3 className="fw-bold mb-1">Déposer une candidature</h3>
                                    <p className="text-muted mb-0">
                                        Remplissez les informations de votre demande de stage.
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

                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">
                                            Domaine de stage <span className="text-danger">*</span>
                                        </label>

                                        <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-briefcase"></i>
                      </span>

                                            <input
                                                type="text"
                                                name="domaineStage"
                                                className="form-control border-start-0"
                                                value={data.domaineStage}
                                                onChange={handleChange}
                                                placeholder="Ex: Développement Web"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-semibold">
                                            Sujet proposé <span className="text-danger">*</span>
                                        </label>

                                        <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-lightbulb"></i>
                      </span>

                                            <input
                                                type="text"
                                                name="sujetPropose"
                                                className="form-control border-start-0"
                                                value={data.sujetPropose}
                                                onChange={handleChange}
                                                placeholder="Ex: Application de gestion"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="card bg-light border-0 rounded-4 mt-3 mb-4">
                                    <div className="card-body">
                                        <h5 className="fw-bold mb-3">
                                            <i className="bi bi-paperclip me-2 text-primary"></i>
                                            Documents
                                        </h5>

                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold">
                                                    CV <span className="text-danger">*</span>
                                                </label>

                                                <input
                                                    ref={cvInputRef}
                                                    type="file"
                                                    className="form-control"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handleCvChange}
                                                    required
                                                />

                                                <small className="text-muted">
                                                    Formats acceptés: PDF, DOC, DOCX — max 5 Mo
                                                </small>

                                                {cv && (
                                                    <div className="mt-2 small text-success">
                                                        <i className="bi bi-file-earmark-check me-1"></i>
                                                        {cv.name} ({formatFileSize(cv.size)})
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-6 mb-3">
                                                <label className="form-label fw-semibold">
                                                    Autre document
                                                </label>

                                                <input
                                                    ref={autreInputRef}
                                                    type="file"
                                                    className="form-control"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handleAutreChange}
                                                />

                                                <small className="text-muted">
                                                    Optionnel: attestation, lettre, portfolio...
                                                </small>

                                                {autre && (
                                                    <div className="mt-2 small text-success">
                                                        <i className="bi bi-file-earmark-check me-1"></i>
                                                        {autre.name} ({formatFileSize(autre.size)})
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="alert alert-info border-0 rounded-3">
                                    <i className="bi bi-info-circle me-2"></i>
                                    Après l’envoi, votre candidature sera enregistrée avec le
                                    statut <strong>EN_ATTENTE</strong>.
                                </div>

                                <div className="d-flex justify-content-end gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={resetForm}
                                        disabled={loading}
                                    >
                                        <i className="bi bi-arrow-counterclockwise me-1"></i>
                                        Réinitialiser
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary px-4"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Envoi...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-send me-1"></i>
                                                Envoyer la candidature
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <p className="text-center text-muted small mt-4">
                        Les documents envoyés seront consultés par le service RH.
                    </p>
                </div>
            </div>
        </div>
    );
}