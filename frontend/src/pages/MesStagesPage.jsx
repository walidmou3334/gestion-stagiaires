import React, { useEffect, useMemo, useState } from "react";
import { getMesStages } from "../services/stageService";
import Pagination from "../components/Pagination";

export default function MesStagesPage() {
    const [stages, setStages] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statutFilter, setStatutFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(4);

    useEffect(() => {
        loadStages();
    }, []);

    const loadStages = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await getMesStages();
            setStages(res.data || []);
        } catch (err) {
            console.error(err);
            setError("Erreur lors du chargement de vos stages");
        } finally {
            setLoading(false);
        }
    };

    const getBadgeClass = (statut) => {
        if (statut === "EN_COURS") {
            return "bg-warning text-dark";
        }

        if (statut === "TERMINE") {
            return "bg-success";
        }

        if (statut === "ANNULE") {
            return "bg-danger";
        }

        return "bg-secondary";
    };

    const filteredStages = useMemo(() => {
        return stages.filter((s) => {
            const text = `
        ${s.id || ""}
        ${s.sujetFinal || ""}
        ${s.service || ""}
        ${s.dateDebut || ""}
        ${s.dateFin || ""}
        ${s.nomEncadrant || ""}
        ${s.prenomEncadrant || ""}
        ${s.emailEncadrant || ""}
        ${s.specialiteEncadrant || ""}
        ${s.statut || ""}
      `.toLowerCase();

            const matchesSearch = text.includes(search.toLowerCase());
            const matchesStatus = !statutFilter || s.statut === statutFilter;

            return matchesSearch && matchesStatus;
        });
    }, [stages, search, statutFilter]);

    const totalPages = Math.ceil(filteredStages.length / pageSize);

    const currentStages = filteredStages.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const totalEnCours = stages.filter(
        (s) => s.statut === "EN_COURS"
    ).length;

    const totalTermines = stages.filter(
        (s) => s.statut === "TERMINE"
    ).length;

    const totalAnnules = stages.filter(
        (s) => s.statut === "ANNULE"
    ).length;

    if (loading) {
        return (
            <div className="container-fluid py-5 text-center">
                <div className="spinner-border text-primary"></div>

                <p className="text-muted mt-3 mb-0">
                    Chargement de vos stages...
                </p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h2 className="fw-bold mb-1">
                        Mon stage
                    </h2>

                    <p className="text-muted mb-0">
                        Consultez les informations de votre stage affecté.
                    </p>
                </div>

                <button
                    className="btn btn-outline-primary"
                    onClick={loadStages}
                >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Actualiser
                </button>
            </div>

            <div className="row mb-4">
                <div className="col-lg-3 col-md-6 mb-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-muted mb-1">
                                    Total stages
                                </p>

                                <h3 className="fw-bold mb-0">
                                    {stages.length}
                                </h3>
                            </div>

                            <div
                                className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex justify-content-center align-items-center"
                                style={{
                                    width: "56px",
                                    height: "56px",
                                    fontSize: "24px",
                                }}
                            >
                                <i className="bi bi-mortarboard"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 mb-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-muted mb-1">
                                    En cours
                                </p>

                                <h3 className="fw-bold text-warning mb-0">
                                    {totalEnCours}
                                </h3>
                            </div>

                            <div
                                className="rounded-circle bg-warning bg-opacity-10 text-warning d-flex justify-content-center align-items-center"
                                style={{
                                    width: "56px",
                                    height: "56px",
                                    fontSize: "24px",
                                }}
                            >
                                <i className="bi bi-hourglass-split"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 mb-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-muted mb-1">
                                    Terminés
                                </p>

                                <h3 className="fw-bold text-success mb-0">
                                    {totalTermines}
                                </h3>
                            </div>

                            <div
                                className="rounded-circle bg-success bg-opacity-10 text-success d-flex justify-content-center align-items-center"
                                style={{
                                    width: "56px",
                                    height: "56px",
                                    fontSize: "24px",
                                }}
                            >
                                <i className="bi bi-check-circle"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 mb-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-muted mb-1">
                                    Annulés
                                </p>

                                <h3 className="fw-bold text-danger mb-0">
                                    {totalAnnules}
                                </h3>
                            </div>

                            <div
                                className="rounded-circle bg-danger bg-opacity-10 text-danger d-flex justify-content-center align-items-center"
                                style={{
                                    width: "56px",
                                    height: "56px",
                                    fontSize: "24px",
                                }}
                            >
                                <i className="bi bi-x-circle"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger border-0 rounded-4">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                </div>
            )}

            <div className="card border-0 shadow-sm rounded-4">
                <div className="card-header bg-white border-0 py-3 px-4">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <h5 className="fw-bold mb-0">
                            Liste de mes stages
                        </h5>

                        <div className="d-flex gap-2 flex-wrap">
                            <input
                                type="text"
                                className="form-control"
                                style={{
                                    width: "260px",
                                }}
                                placeholder="Rechercher..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />

                            <select
                                className="form-select"
                                style={{
                                    width: "180px",
                                }}
                                value={statutFilter}
                                onChange={(e) => {
                                    setStatutFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="">
                                    Tous les statuts
                                </option>

                                <option value="EN_COURS">
                                    En cours
                                </option>

                                <option value="TERMINE">
                                    Terminé
                                </option>

                                <option value="ANNULE">
                                    Annulé
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    {currentStages.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <i
                                className="bi bi-inbox d-block mb-3"
                                style={{
                                    fontSize: "48px",
                                }}
                            ></i>

                            Aucun stage affecté.
                        </div>
                    ) : (
                        <div className="row">
                            {currentStages.map((s) => (
                                <div className="col-lg-6 mb-3" key={s.id}>
                                    <div className="card border-0 bg-light rounded-4 h-100">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div>
                                                    <h5 className="fw-bold mb-1">
                                                        {s.sujetFinal || "Sujet non défini"}
                                                    </h5>

                                                    <p className="text-muted small mb-0">
                                                        {s.service || "Service non défini"}
                                                    </p>
                                                </div>

                                                <span className={`badge ${getBadgeClass(s.statut)}`}>
                          {s.statut || "-"}
                        </span>
                                            </div>

                                            <div className="row mt-3">
                                                <div className="col-md-6 mb-3">
                                                    <small className="text-muted d-block">
                                                        Date début
                                                    </small>

                                                    <span className="fw-semibold">
                            <i className="bi bi-calendar-date text-primary me-1"></i>
                                                        {s.dateDebut || "-"}
                          </span>
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <small className="text-muted d-block">
                                                        Date fin
                                                    </small>

                                                    <span className="fw-semibold">
                            <i className="bi bi-calendar-check text-success me-1"></i>
                                                        {s.dateFin || "-"}
                          </span>
                                                </div>
                                            </div>

                                            <div className="border-top pt-3 mt-2">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div
                                                        className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex justify-content-center align-items-center"
                                                        style={{
                                                            width: "48px",
                                                            height: "48px",
                                                            fontSize: "22px",
                                                        }}
                                                    >
                                                        <i className="bi bi-person-workspace"></i>
                                                    </div>

                                                    <div>
                                                        <small className="text-muted d-block">
                                                            Encadrant
                                                        </small>

                                                        <div className="fw-semibold">
                                                            {s.nomEncadrant || "-"} {s.prenomEncadrant || ""}
                                                        </div>

                                                        <div className="text-muted small">
                                                            <i className="bi bi-envelope me-1"></i>
                                                            {s.emailEncadrant || "-"}
                                                        </div>

                                                        <div className="text-muted small">
                                                            <i className="bi bi-award me-1"></i>
                                                            {s.specialiteEncadrant || "-"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageSize={pageSize}
                        totalItems={filteredStages.length}
                        setCurrentPage={setCurrentPage}
                        setPageSize={setPageSize}
                    />
                </div>
            </div>
        </div>
    );
}