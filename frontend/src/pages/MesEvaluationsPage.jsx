import React, { useEffect, useMemo, useState } from "react";
import { getMesEvaluations } from "../services/evaluationService";
import Pagination from "../components/Pagination";

export default function MesEvaluationsPage() {
    const [evaluations, setEvaluations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statutFilter, setStatutFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    useEffect(() => {
        loadEvaluations();
    }, []);

    const loadEvaluations = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await getMesEvaluations();
            setEvaluations(res.data || []);
        } catch (err) {
            console.error(err);
            setError("Erreur lors du chargement des évaluations");
        } finally {
            setLoading(false);
        }
    };

    const filteredEvaluations = useMemo(() => {
        return evaluations.filter((e) => {
            const text = `
        ${e.sujetFinal || ""}
        ${e.service || ""}
        ${e.note || ""}
        ${e.statut || ""}
        ${e.appreciation || ""}
        ${e.nomEncadrant || ""}
        ${e.prenomEncadrant || ""}
      `.toLowerCase();

            const matchesSearch = text.includes(search.toLowerCase());

            const matchesStatus =
                !statutFilter || e.statut === statutFilter;

            return matchesSearch && matchesStatus;
        });
    }, [evaluations, search, statutFilter]);

    const totalPages = Math.ceil(
        filteredEvaluations.length / pageSize
    );

    const currentEvaluations = filteredEvaluations.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const moyenne =
        evaluations.length > 0
            ? (
                evaluations.reduce(
                    (sum, e) => sum + Number(e.note || 0),
                    0
                ) / evaluations.length
            ).toFixed(2)
            : 0;

    const totalValidees = evaluations.filter(
        (e) => e.statut === "VALIDE"
    ).length;

    const totalNonValidees = evaluations.filter(
        (e) => e.statut === "NON_VALIDE"
    ).length;

    const getBadgeClass = (statut) => {
        if (statut === "VALIDE") {
            return "bg-success";
        }

        if (statut === "NON_VALIDE") {
            return "bg-danger";
        }

        return "bg-secondary";
    };

    if (loading) {
        return (
            <div className="container-fluid py-5 text-center">
                <div className="spinner-border text-primary"></div>

                <p className="text-muted mt-3">
                    Chargement des évaluations...
                </p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

                <div>
                    <h2 className="fw-bold mb-1">
                        Mes évaluations
                    </h2>

                    <p className="text-muted mb-0">
                        Consultez vos résultats et appréciations.
                    </p>
                </div>

                <button
                    className="btn btn-outline-primary"
                    onClick={loadEvaluations}
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
                                    Évaluations
                                </p>

                                <h3 className="fw-bold mb-0">
                                    {evaluations.length}
                                </h3>
                            </div>

                            <div
                                className="rounded-circle bg-primary bg-opacity-10 text-primary
                d-flex justify-content-center align-items-center"
                                style={{
                                    width: "56px",
                                    height: "56px",
                                    fontSize: "24px",
                                }}
                            >
                                <i className="bi bi-clipboard-check"></i>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 mb-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body d-flex justify-content-between align-items-center">

                            <div>
                                <p className="text-muted mb-1">
                                    Validées
                                </p>

                                <h3 className="fw-bold text-success mb-0">
                                    {totalValidees}
                                </h3>
                            </div>

                            <div
                                className="rounded-circle bg-success bg-opacity-10 text-success
                d-flex justify-content-center align-items-center"
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
                                    Non validées
                                </p>

                                <h3 className="fw-bold text-danger mb-0">
                                    {totalNonValidees}
                                </h3>
                            </div>

                            <div
                                className="rounded-circle bg-danger bg-opacity-10 text-danger
                d-flex justify-content-center align-items-center"
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

                <div className="col-lg-3 col-md-6 mb-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body d-flex justify-content-between align-items-center">

                            <div>
                                <p className="text-muted mb-1">
                                    Moyenne
                                </p>

                                <h3 className="fw-bold text-warning mb-0">
                                    {moyenne}/20
                                </h3>
                            </div>

                            <div
                                className="rounded-circle bg-warning bg-opacity-10 text-warning
                d-flex justify-content-center align-items-center"
                                style={{
                                    width: "56px",
                                    height: "56px",
                                    fontSize: "24px",
                                }}
                            >
                                <i className="bi bi-star"></i>
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
                            Liste des évaluations
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

                                <option value="VALIDE">
                                    VALIDE
                                </option>

                                <option value="NON_VALIDE">
                                    NON VALIDE
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

                <div className="card-body">

                    {currentEvaluations.length === 0 ? (

                        <div className="text-center py-5 text-muted">

                            <i
                                className="bi bi-inbox d-block mb-3"
                                style={{
                                    fontSize: "48px",
                                }}
                            ></i>

                            Aucune évaluation trouvée.

                        </div>

                    ) : (

                        <div className="row">

                            {currentEvaluations.map((e) => (

                                <div
                                    className="col-lg-6 mb-3"
                                    key={e.id}
                                >

                                    <div className="card border-0 bg-light rounded-4 h-100">

                                        <div className="card-body">

                                            <div className="d-flex justify-content-between align-items-start mb-3">

                                                <div>

                                                    <h5 className="fw-bold mb-1">
                                                        {e.sujetFinal}
                                                    </h5>

                                                    <p className="text-muted small mb-0">
                                                        {e.service}
                                                    </p>

                                                </div>

                                                <span
                                                    className={`badge ${getBadgeClass(e.statut)}`}
                                                >
                          {e.statut}
                        </span>

                                            </div>

                                            <div className="mb-3">

                                                <div className="d-flex justify-content-between align-items-center mb-2">

                          <span className="fw-semibold">
                            Note
                          </span>

                                                    <span className="badge bg-primary">
                            {e.note}/20
                          </span>

                                                </div>

                                                <div className="progress" style={{ height: "8px" }}>

                                                    <div
                                                        className={`progress-bar ${
                                                            e.note >= 12
                                                                ? "bg-success"
                                                                : "bg-danger"
                                                        }`}
                                                        style={{
                                                            width: `${(e.note / 20) * 100}%`,
                                                        }}
                                                    ></div>

                                                </div>

                                            </div>

                                            <div className="mb-3">

                                                <p className="fw-semibold mb-1">
                                                    Appréciation
                                                </p>

                                                <div className="bg-white rounded-3 p-3 border small">
                                                    {e.appreciation || "-"}
                                                </div>

                                            </div>

                                            <div className="border-top pt-3">

                                                <div className="row">

                                                    <div className="col-6">

                                                        <small className="text-muted d-block">
                                                            Encadrant
                                                        </small>

                                                        <span className="fw-semibold">
                              {e.nomEncadrant}{" "}
                                                            {e.prenomEncadrant}
                            </span>

                                                    </div>

                                                    <div className="col-6 text-end">

                                                        <small className="text-muted d-block">
                                                            Date
                                                        </small>

                                                        <span className="fw-semibold">
                              {e.dateEvaluation || "-"}
                            </span>

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
                        totalItems={filteredEvaluations.length}
                        setCurrentPage={setCurrentPage}
                        setPageSize={setPageSize}
                    />

                </div>

            </div>

        </div>
    );
}