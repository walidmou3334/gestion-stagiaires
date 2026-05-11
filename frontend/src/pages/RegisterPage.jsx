import React, { useState } from "react";
import { registerUser } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        motDePasse: "",
        role: "CANDIDAT",

        nom: "",
        prenom: "",
        telephone: "",
        adresse: "",

        niveauEtude: "",
        domaine: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const totalSteps = 3;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateStep = () => {
        setError("");

        if (step === 1) {
            if (!formData.username.trim()) {
                setError("Le username est obligatoire");
                return false;
            }

            if (!formData.email.trim()) {
                setError("L'email est obligatoire");
                return false;
            }

            if (!formData.motDePasse.trim()) {
                setError("Le mot de passe est obligatoire");
                return false;
            }
        }

        if (step === 2) {
            if (!formData.nom.trim()) {
                setError("Le nom est obligatoire");
                return false;
            }

            if (!formData.prenom.trim()) {
                setError("Le prénom est obligatoire");
                return false;
            }
        }

        return true;
    };

    const nextStep = () => {
        if (!validateStep()) return;

        if (step < totalSteps) {
            setStep(step + 1);
        }
    };

    const previousStep = () => {
        setError("");

        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep()) return;

        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await registerUser(formData);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("role", response.data.role);

            setMessage("Compte candidat créé avec succès");

            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message || "Erreur lors de l'inscription"
            );
        } finally {
            setLoading(false);
        }
    };

    const progress = (step / totalSteps) * 100;

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{
                background:
                    "linear-gradient(135deg,#edf2f9,#f8fbff)",
            }}
        >
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-9 col-xl-8">
                        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="card-body p-4 p-md-5">

                                <div className="text-center mb-4">
                                    <div
                                        className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center mx-auto mb-3"
                                        style={{
                                            width: "70px",
                                            height: "70px",
                                            fontSize: "32px",
                                        }}
                                    >
                                        <i className="bi bi-person-plus"></i>
                                    </div>

                                    <h3 className="fw-bold mb-1">
                                        Créer un compte candidat
                                    </h3>

                                    <p className="text-muted mb-0">
                                        Complétez les informations étape par étape
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between mb-2">
                    <span className="small text-muted">
                      Étape {step} sur {totalSteps}
                    </span>

                                        <span className="small fw-semibold text-primary">
                      {Math.round(progress)}%
                    </span>
                                    </div>

                                    <div className="progress" style={{ height: "8px" }}>
                                        <div
                                            className="progress-bar"
                                            style={{
                                                width: `${progress}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between text-center mb-4">
                                    <div
                                        className={
                                            step >= 1
                                                ? "text-primary fw-semibold"
                                                : "text-muted"
                                        }
                                    >
                                        <div>
                                            <i className="bi bi-person-circle fs-4"></i>
                                        </div>
                                        <small>Compte</small>
                                    </div>

                                    <div
                                        className={
                                            step >= 2
                                                ? "text-primary fw-semibold"
                                                : "text-muted"
                                        }
                                    >
                                        <div>
                                            <i className="bi bi-card-list fs-4"></i>
                                        </div>
                                        <small>Informations</small>
                                    </div>

                                    <div
                                        className={
                                            step >= 3
                                                ? "text-primary fw-semibold"
                                                : "text-muted"
                                        }
                                    >
                                        <div>
                                            <i className="bi bi-mortarboard fs-4"></i>
                                        </div>
                                        <small>Formation</small>
                                    </div>
                                </div>

                                {message && (
                                    <div className="alert alert-success border-0 rounded-3">
                                        {message}
                                    </div>
                                )}

                                {error && (
                                    <div className="alert alert-danger border-0 rounded-3">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>

                                    {step === 1 && (
                                        <>
                                            <h5 className="fw-bold mb-3">
                                                Informations du compte
                                            </h5>

                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">
                                                    Username
                                                </label>

                                                <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-person"></i>
                          </span>

                                                    <input
                                                        type="text"
                                                        name="username"
                                                        className="form-control border-start-0"
                                                        value={formData.username}
                                                        onChange={handleChange}
                                                        placeholder="Votre username"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">
                                                    Email
                                                </label>

                                                <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-envelope"></i>
                          </span>

                                                    <input
                                                        type="email"
                                                        name="email"
                                                        className="form-control border-start-0"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="exemple@email.com"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">
                                                    Mot de passe
                                                </label>

                                                <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-lock"></i>
                          </span>

                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        name="motDePasse"
                                                        className="form-control border-start-0 border-end-0"
                                                        value={formData.motDePasse}
                                                        onChange={handleChange}
                                                        placeholder="Votre mot de passe"
                                                        required
                                                    />

                                                    <button
                                                        type="button"
                                                        className="input-group-text bg-light"
                                                        onClick={() =>
                                                            setShowPassword(!showPassword)
                                                        }
                                                    >
                                                        <i
                                                            className={
                                                                showPassword
                                                                    ? "bi bi-eye-slash"
                                                                    : "bi bi-eye"
                                                            }
                                                        ></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {step === 2 && (
                                        <>
                                            <h5 className="fw-bold mb-3">
                                                Informations personnelles
                                            </h5>

                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label fw-semibold">
                                                        Nom
                                                    </label>

                                                    <input
                                                        type="text"
                                                        name="nom"
                                                        className="form-control"
                                                        value={formData.nom}
                                                        onChange={handleChange}
                                                        placeholder="Votre nom"
                                                        required
                                                    />
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label fw-semibold">
                                                        Prénom
                                                    </label>

                                                    <input
                                                        type="text"
                                                        name="prenom"
                                                        className="form-control"
                                                        value={formData.prenom}
                                                        onChange={handleChange}
                                                        placeholder="Votre prénom"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">
                                                    Téléphone
                                                </label>

                                                <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-telephone"></i>
                          </span>

                                                    <input
                                                        type="text"
                                                        name="telephone"
                                                        className="form-control border-start-0"
                                                        value={formData.telephone}
                                                        onChange={handleChange}
                                                        placeholder="Votre téléphone"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">
                                                    Adresse
                                                </label>

                                                <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-geo-alt"></i>
                          </span>

                                                    <input
                                                        type="text"
                                                        name="adresse"
                                                        className="form-control border-start-0"
                                                        value={formData.adresse}
                                                        onChange={handleChange}
                                                        placeholder="Votre adresse"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {step === 3 && (
                                        <>
                                            <h5 className="fw-bold mb-3">
                                                Formation
                                            </h5>

                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">
                                                    Niveau d'étude
                                                </label>

                                                <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-mortarboard"></i>
                          </span>

                                                    <input
                                                        type="text"
                                                        name="niveauEtude"
                                                        className="form-control border-start-0"
                                                        value={formData.niveauEtude}
                                                        onChange={handleChange}
                                                        placeholder="Ex: Bac+2, Licence, Master"
                                                    />
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">
                                                    Domaine
                                                </label>

                                                <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-book"></i>
                          </span>

                                                    <input
                                                        type="text"
                                                        name="domaine"
                                                        className="form-control border-start-0"
                                                        value={formData.domaine}
                                                        onChange={handleChange}
                                                        placeholder="Ex: Informatique, Réseaux, Gestion"
                                                    />
                                                </div>
                                            </div>

                                            <div className="alert alert-info border-0 rounded-3 mt-4">
                                                <i className="bi bi-info-circle me-2"></i>
                                                Votre compte sera créé avec le rôle{" "}
                                                <strong>CANDIDAT</strong>.
                                            </div>
                                        </>
                                    )}

                                    <div className="d-flex justify-content-between mt-4">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={previousStep}
                                            disabled={step === 1 || loading}
                                        >
                                            <i className="bi bi-arrow-left me-1"></i>
                                            Précédent
                                        </button>

                                        {step < totalSteps ? (
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={nextStep}
                                                disabled={loading}
                                            >
                                                Suivant
                                                <i className="bi bi-arrow-right ms-1"></i>
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                className="btn btn-success"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Inscription...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-check-circle me-1"></i>
                                                        Créer le compte
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </form>

                                <div className="text-center mt-4">
                  <span className="text-muted">
                    Déjà un compte ?
                  </span>

                                    <Link
                                        to="/login"
                                        className="ms-2 fw-semibold text-decoration-none"
                                    >
                                        Connexion
                                    </Link>
                                </div>

                            </div>
                        </div>

                        <p className="text-center text-muted small mt-4 mb-0">
                            © 2026 Gestion des Stagiaires
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}