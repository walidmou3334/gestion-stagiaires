import React, { useEffect, useState } from "react";
import { getMyProfile } from "../services/authService";

export default function ProfilePage() {
    const [profileData, setProfileData] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");
            const response = await getMyProfile(token);

            setProfileData(response.data);
        } catch (err) {
            console.error(err);
            setError("Impossible de charger le profil");
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadgeClass = (role) => {
        if (role === "ADMIN") {
            return "bg-danger";
        }

        if (role === "RH") {
            return "bg-primary";
        }

        if (role === "ENCADRANT") {
            return "bg-info";
        }

        if (role === "CANDIDAT") {
            return "bg-success";
        }

        return "bg-secondary";
    };

    const InfoItem = ({ icon, label, value }) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return null;
        }

        return (
            <div className="col-md-6 mb-3">
                <div className="bg-light rounded-4 p-3 h-100 border">
                    <div className="d-flex align-items-start gap-3">
                        <div
                            className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex justify-content-center align-items-center"
                            style={{
                                width: "42px",
                                height: "42px",
                                fontSize: "18px",
                            }}
                        >
                            <i className={icon}></i>
                        </div>

                        <div>
                            <small className="text-muted d-block">
                                {label}
                            </small>

                            <span className="fw-semibold">
                {value}
              </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="container-fluid py-5 text-center">
                <div className="spinner-border text-primary"></div>

                <p className="text-muted mt-3 mb-0">
                    Chargement du profil...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid py-5">
                <div className="alert alert-danger border-0 rounded-4 shadow-sm">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="container-fluid py-5">
                <div className="alert alert-info border-0 rounded-4 shadow-sm">
                    Aucun profil disponible.
                </div>
            </div>
        );
    }

    const { username, email, role, actif, profil } =
        profileData;

    const fullName =
        profil?.nom || profil?.prenom
            ? `${profil?.prenom || ""} ${profil?.nom || ""}`.trim()
            : username;

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h2 className="fw-bold mb-1">
                        Mon profil
                    </h2>

                    <p className="text-muted mb-0">
                        Consultez vos informations personnelles et métier.
                    </p>
                </div>

                <button
                    className="btn btn-outline-primary"
                    onClick={fetchProfile}
                >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Actualiser
                </button>
            </div>

            <div className="row">
                <div className="col-lg-4 mb-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body text-center p-4">
                            <div
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                                style={{
                                    width: "95px",
                                    height: "95px",
                                    fontSize: "40px",
                                }}
                            >
                                <i className="bi bi-person"></i>
                            </div>

                            <h4 className="fw-bold mb-1">
                                {fullName}
                            </h4>

                            <p className="text-muted mb-3">
                                @{username}
                            </p>

                            <span
                                className={`badge ${getRoleBadgeClass(
                                    role
                                )} px-3 py-2 rounded-pill`}
                            >
                {role}
              </span>

                            <div className="border-top mt-4 pt-4">
                                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">
                    Email
                  </span>

                                    <span className="fw-semibold text-truncate ms-2">
                    {email}
                  </span>
                                </div>

                                <div className="d-flex justify-content-between">
                  <span className="text-muted">
                    Compte actif
                  </span>

                                    <span
                                        className={`badge ${
                                            actif
                                                ? "bg-success"
                                                : "bg-danger"
                                        }`}
                                    >
                    {actif ? "Oui" : "Non"}
                  </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8 mb-4">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-header bg-white border-0 py-3 px-4">
                            <h5 className="fw-bold mb-0">
                                Informations du compte
                            </h5>
                        </div>

                        <div className="card-body px-4">
                            <div className="row">
                                <InfoItem
                                    icon="bi bi-person"
                                    label="Username"
                                    value={username}
                                />

                                <InfoItem
                                    icon="bi bi-envelope"
                                    label="Email"
                                    value={email}
                                />

                                <InfoItem
                                    icon="bi bi-shield-check"
                                    label="Rôle"
                                    value={role}
                                />

                                <InfoItem
                                    icon="bi bi-check-circle"
                                    label="Actif"
                                    value={actif ? "Oui" : "Non"}
                                />
                            </div>
                        </div>
                    </div>

                    {profil && (
                        <div className="card border-0 shadow-sm rounded-4 mt-4">
                            <div className="card-header bg-white border-0 py-3 px-4">
                                <h5 className="fw-bold mb-0">
                                    Informations métier
                                </h5>
                            </div>

                            <div className="card-body px-4">
                                <div className="row">
                                    <InfoItem
                                        icon="bi bi-person-badge"
                                        label="Nom"
                                        value={profil.nom}
                                    />

                                    <InfoItem
                                        icon="bi bi-person-badge-fill"
                                        label="Prénom"
                                        value={profil.prenom}
                                    />

                                    <InfoItem
                                        icon="bi bi-telephone"
                                        label="Téléphone"
                                        value={profil.telephone}
                                    />

                                    <InfoItem
                                        icon="bi bi-geo-alt"
                                        label="Adresse"
                                        value={profil.adresse}
                                    />

                                    <InfoItem
                                        icon="bi bi-mortarboard"
                                        label="Niveau d'étude"
                                        value={profil.niveauEtude}
                                    />

                                    <InfoItem
                                        icon="bi bi-book"
                                        label="Domaine"
                                        value={profil.domaine}
                                    />

                                    <InfoItem
                                        icon="bi bi-credit-card"
                                        label="Matricule"
                                        value={profil.matricule}
                                    />

                                    <InfoItem
                                        icon="bi bi-building"
                                        label="Service"
                                        value={profil.service}
                                    />

                                    <InfoItem
                                        icon="bi bi-award"
                                        label="Spécialité"
                                        value={profil.specialite}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}