import React, { useState } from "react";
import { loginUser } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        motDePasse: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await loginUser(formData);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("role", response.data.role);

            setMessage("Connexion réussie");
            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message || "Username ou mot de passe incorrect"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-vh-100 d-flex align-items-center justify-content-center"
            style={{
                background:
                    "linear-gradient(135deg, #edf2f9 0%, #f9fbfd 45%, #e3e9f5 100%)",
            }}
        >
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    <div className="col-lg-10 col-xl-9">
                        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                            <div className="row g-0">
                                <div className="col-lg-6 d-none d-lg-flex bg-primary text-white p-5 align-items-center">
                                    <div>
                                        <div
                                            className="rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center mb-4"
                                            style={{
                                                width: "70px",
                                                height: "70px",
                                                fontSize: "34px",
                                            }}
                                        >
                                            <i className="bi bi-mortarboard"></i>
                                        </div>

                                        <h2 className="fw-bold mb-3">
                                            Gestion des Stagiaires
                                        </h2>

                                        <p className="mb-4 opacity-75">
                                            Connectez-vous pour gérer les candidatures, les stages,
                                            les livrables et les évaluations.
                                        </p>

                                        <div className="d-flex gap-3">
                                            <div>
                                                <h4 className="fw-bold mb-0">RH</h4>
                                                <small className="opacity-75">Gestion complète</small>
                                            </div>

                                            <div>
                                                <h4 className="fw-bold mb-0">Encadrant</h4>
                                                <small className="opacity-75">Suivi stagiaires</small>
                                            </div>

                                            <div>
                                                <h4 className="fw-bold mb-0">Candidat</h4>
                                                <small className="opacity-75">Espace personnel</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6 bg-white p-4 p-md-5">
                                    <div className="text-center mb-4">
                                        <h3 className="fw-bold mb-1">Connexion</h3>
                                        <p className="text-muted mb-0">
                                            Entrez vos identifiants pour continuer
                                        </p>
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
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    <i
                                                        className={
                                                            showPassword ? "bi bi-eye-slash" : "bi bi-eye"
                                                        }
                                                    ></i>
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100 py-2 fw-semibold"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                                    Connexion...
                                                </>
                                            ) : (
                                                "Se connecter"
                                            )}
                                        </button>
                                    </form>

                                    <div className="text-center mt-4">
                                        <span className="text-muted">Vous n'avez pas de compte ? </span>
                                        <Link to="/register" className="text-decoration-none fw-semibold">
                                            Créer un compte
                                        </Link>
                                    </div>
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