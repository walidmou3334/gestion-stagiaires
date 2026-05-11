import React, { useEffect, useMemo, useState } from "react";
import { getAllEvaluationsRh } from "../services/evaluationService";
import Pagination from "../components/Pagination";

export default function RhEvaluationsPage() {
    const [evaluations, setEvaluations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statutFilter, setStatutFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        loadEvaluations();
    }, []);

    const loadEvaluations = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await getAllEvaluationsRh();
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
        ${e.id || ""}
        ${e.nomCandidat || ""}
        ${e.prenomCandidat || ""}
        ${e.nomEncadrant || ""}
        ${e.prenomEncadrant || ""}
        ${e.sujetFinal || ""}
        ${e.note || ""}
        ${e.statut || ""}
        ${e.dateEvaluation || ""}
        ${e.appreciation || ""}
      `.toLowerCase();

            const matchesSearch = text.includes(search.toLowerCase());
            const matchesStatus = !statutFilter || e.statut === statutFilter;

            return matchesSearch && matchesStatus;
        });
    }, [evaluations, search, statutFilter]);

    const totalPages = Math.ceil(filteredEvaluations.length / pageSize);

    const currentEvaluations = filteredEvaluations.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const totalValidees = evaluations.filter(
        (e) => e.statut === "VALIDE"
    ).length;

    const totalNonValidees = evaluations.filter(
        (e) => e.statut === "NON_VALIDE"
    ).length;

    const moyenne =
        evaluations.length > 0
            ? (
                evaluations.reduce(
                    (sum, e) => sum + Number(e.note || 0),
                    0
                ) / evaluations.length
            ).toFixed(2)
            : 0;

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

                <p className="text-muted mt-3 mb-0">
                    Chargement des évaluations...
                </p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h2 className="fw-bold mb-1">Évaluations finales</h2>

                    <p className="text-muted mb-0">
                        Consultez toutes les évaluations finales des stagiaires.
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
                                <p className="text-muted mb-1">Total</p>
                                <h3 className="fw-bold mb-0">{evaluations.length}</h3>
                            </div>

                            <div
                                className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex justify-content-center align-items-center"
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
                                <p className="text-muted mb-1">Validées</p>
                                <h3 className="fw-bold text-success mb-0">{totalValidees}</h3>
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
                                <p className="text-muted mb-1">Non validées</p>
                                <h3 className="fw-bold text-danger mb-0">{totalNonValidees}</h3>
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

                <div className="col-lg-3 col-md-6 mb-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-muted mb-1">Moyenne</p>
                                <h3 className="fw-bold text-warning mb-0">{moyenne}/20</h3>
                            </div>

                            <div
                                className="rounded-circle bg-warning bg-opacity-10 text-warning d-flex justify-content-center align-items-center"
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
                        <h5 className="fw-bold mb-0">Liste des évaluations</h5>

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
                                <option value="">Tous les statuts</option>
                                <option value="VALIDE">VALIDE</option>
                                <option value="NON_VALIDE">NON VALIDE</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Stagiaire</th>
                                <th>Encadrant</th>
                                <th>Stage</th>
                                <th>Note</th>
                                <th>Résultat</th>
                                <th>Date</th>
                                <th>Appréciation</th>
                            </tr>
                            </thead>

                            <tbody>
                            {currentEvaluations.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-5 text-muted">
                                        <i
                                            className="bi bi-inbox d-block mb-3"
                                            style={{
                                                fontSize: "44px",
                                            }}
                                        ></i>
                                        Aucune évaluation trouvée.
                                    </td>
                                </tr>
                            ) : (
                                currentEvaluations.map((e) => (
                                    <tr key={e.id}>
                                        <td>
                                            <span className="fw-semibold">#{e.id}</span>
                                        </td>

                                        <td>
                                            <div className="fw-semibold">
                                                {e.nomCandidat} {e.prenomCandidat}
                                            </div>
                                        </td>

                                        <td>
                                            {e.nomEncadrant} {e.prenomEncadrant}
                                        </td>

                                        <td>
                        <span
                            className="d-inline-block text-truncate"
                            style={{
                                maxWidth: "220px",
                            }}
                            title={e.sujetFinal}
                        >
                          {e.sujetFinal || "-"}
                        </span>
                                        </td>

                                        <td>
                        <span className="badge bg-primary">
                          {e.note}/20
                        </span>
                                        </td>

                                        <td>
                        <span className={`badge ${getBadgeClass(e.statut)}`}>
                          {e.statut || "-"}
                        </span>
                                        </td>

                                        <td>{e.dateEvaluation || "-"}</td>

                                        <td>
                        <span
                            className="d-inline-block text-truncate"
                            style={{
                                maxWidth: "250px",
                            }}
                            title={e.appreciation}
                        >
                          {e.appreciation || "-"}
                        </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

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