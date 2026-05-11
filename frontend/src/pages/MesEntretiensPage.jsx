import React, { useEffect, useMemo, useState } from "react";
import { getMesEntretiens } from "../services/entretienService";
import Pagination from "../components/Pagination";

export default function MesEntretiensPage() {
    const [entretiens, setEntretiens] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statutFilter, setStatutFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    useEffect(() => {
        loadEntretiens();
    }, []);

    const loadEntretiens = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await getMesEntretiens();
            setEntretiens(res.data || []);
        } catch (err) {
            console.error(err);
            setError("Impossible de charger vos entretiens");
        } finally {
            setLoading(false);
        }
    };

    const getBadgeClass = (statut) => {
        if (statut === "PLANIFIE") {
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

    const filteredEntretiens = useMemo(() => {
        return entretiens.filter((e) => {
            const text = `
        ${e.id || ""}
        ${e.domaineStage || ""}
        ${e.sujetPropose || ""}
        ${e.dateEntretien || ""}
        ${e.heureEntretien || ""}
        ${e.lieu || ""}
        ${e.commentaire || ""}
        ${e.statut || ""}
      `.toLowerCase();

            const matchesSearch = text.includes(search.toLowerCase());
            const matchesStatus = !statutFilter || e.statut === statutFilter;

            return matchesSearch && matchesStatus;
        });
    }, [entretiens, search, statutFilter]);

    const totalPages = Math.ceil(filteredEntretiens.length / pageSize);

    const currentEntretiens = filteredEntretiens.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const totalPlanifies = entretiens.filter(
        (e) => e.statut === "PLANIFIE"
    ).length;

    const totalTermines = entretiens.filter(
        (e) => e.statut === "TERMINE"
    ).length;

    const totalAnnules = entretiens.filter(
        (e) => e.statut === "ANNULE"
    ).length;

    if (loading) {
        return (
            <div className="container-fluid py-5 text-center">
                <div className="spinner-border text-primary"></div>

                <p className="text-muted mt-3 mb-0">
                    Chargement de vos entretiens...
                </p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h2 className="fw-bold mb-1">
                        Mes entretiens
                    </h2>

                    <p className="text-muted mb-0">
                        Consultez les entretiens planifiés pour vos candidatures.
                    </p>
                </div>

                <button
                    className="btn btn-outline-primary"
                    onClick={loadEntretiens}
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
                                    Total
                                </p>

                                <h3 className="fw-bold mb-0">
                                    {entretiens.length}
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
                                <i className="bi bi-calendar-event"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 mb-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-muted mb-1">
                                    Planifiés
                                </p>

                                <h3 className="fw-bold text-warning mb-0">
                                    {totalPlanifies}
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
                            Liste de mes entretiens
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
                                <option value="PLANIFIE">
                                    Planifié
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
                    {currentEntretiens.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <i
                                className="bi bi-calendar-x d-block mb-3"
                                style={{
                                    fontSize: "48px",
                                }}
                            ></i>

                            Aucun entretien trouvé.
                        </div>
                    ) : (
                        <div className="row">
                            {currentEntretiens.map((e) => (
                                <div className="col-lg-6 mb-3" key={e.id}>
                                    <div className="card border-0 bg-light rounded-4 h-100">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div>
                                                    <h5 className="fw-bold mb-1">
                                                        {e.domaineStage || "Domaine non défini"}
                                                    </h5>

                                                    <p className="text-muted small mb-0">
                                                        {e.sujetPropose || "Sujet non défini"}
                                                    </p>
                                                </div>

                                                <span className={`badge ${getBadgeClass(e.statut)}`}>
                          {e.statut || "PLANIFIE"}
                        </span>
                                            </div>

                                            <div className="mt-3">
                                                <p className="mb-2">
                                                    <i className="bi bi-calendar-date text-primary me-2"></i>
                                                    <strong>Date :</strong>{" "}
                                                    {e.dateEntretien || "-"}
                                                </p>

                                                <p className="mb-2">
                                                    <i className="bi bi-clock text-warning me-2"></i>
                                                    <strong>Heure :</strong>{" "}
                                                    {e.heureEntretien || "-"}
                                                </p>

                                                <p className="mb-2">
                                                    <i className="bi bi-geo-alt text-danger me-2"></i>
                                                    <strong>Lieu :</strong>{" "}
                                                    {e.lieu || "-"}
                                                </p>

                                                <p className="mb-0">
                                                    <i className="bi bi-chat-left-text text-success me-2"></i>
                                                    <strong>Commentaire :</strong>{" "}
                                                    {e.commentaire || "-"}
                                                </p>
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
                        totalItems={filteredEntretiens.length}
                        setCurrentPage={setCurrentPage}
                        setPageSize={setPageSize}
                    />
                </div>
            </div>
        </div>
    );
}