import React, { useEffect, useMemo, useState } from "react";
import { getMyCandidatures, downloadCv } from "../services/candidatureService";
import Pagination from "../components/Pagination";

export default function MesCandidaturesPage() {
    const [list, setList] = useState([]);

    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statutFilter, setStatutFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        loadCandidatures();
    }, []);

    const loadCandidatures = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await getMyCandidatures();
            setList(res.data || []);
        } catch (err) {
            console.error(err);
            setError("Erreur lors du chargement de vos candidatures");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (id) => {
        try {
            setDownloadingId(id);
            setError("");
            await downloadCv(id);
            setMessage("Téléchargement du CV lancé avec succès");
        } catch (err) {
            console.error(err);
            setError("Erreur téléchargement CV");
        } finally {
            setDownloadingId(null);
        }
    };

    const filteredList = useMemo(() => {
        return list.filter((c) => {
            const text = `
        ${c.id || ""}
        ${c.domaineStage || ""}
        ${c.sujetPropose || ""}
        ${c.statut || ""}
      `.toLowerCase();

            const matchesSearch = text.includes(search.toLowerCase());
            const matchesStatus = !statutFilter || c.statut === statutFilter;

            return matchesSearch && matchesStatus;
        });
    }, [list, search, statutFilter]);

    const totalPages = Math.ceil(filteredList.length / pageSize);

    const currentCandidatures = filteredList.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const totalEnAttente = list.filter(
        (c) => c.statut === "EN_ATTENTE"
    ).length;

    const totalAcceptees = list.filter(
        (c) => c.statut === "ACCEPTEE"
    ).length;

    const totalRefusees = list.filter(
        (c) => c.statut === "REFUSEE"
    ).length;

    const getBadgeClass = (statut) => {
        if (statut === "ACCEPTEE") {
            return "bg-success";
        }

        if (statut === "REFUSEE") {
            return "bg-danger";
        }

        if (statut === "EN_ATTENTE") {
            return "bg-warning text-dark";
        }

        return "bg-secondary";
    };

    if (loading) {
        return (
            <div className="container-fluid py-5 text-center">
                <div className="spinner-border text-primary"></div>

                <p className="text-muted mt-3 mb-0">
                    Chargement de vos candidatures...
                </p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h2 className="fw-bold mb-1">
                        Mes candidatures
                    </h2>

                    <p className="text-muted mb-0">
                        Consultez vos demandes de stage et téléchargez votre CV.
                    </p>
                </div>

                <button
                    className="btn btn-outline-primary"
                    onClick={loadCandidatures}
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
                                    {list.length}
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
                                <i className="bi bi-file-earmark-text"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-3 col-md-6 mb-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-muted mb-1">
                                    En attente
                                </p>

                                <h3 className="fw-bold text-warning mb-0">
                                    {totalEnAttente}
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
                                    Acceptées
                                </p>

                                <h3 className="fw-bold text-success mb-0">
                                    {totalAcceptees}
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
                                    Refusées
                                </p>

                                <h3 className="fw-bold text-danger mb-0">
                                    {totalRefusees}
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

            {message && (
                <div className="alert alert-success border-0 rounded-4">
                    <i className="bi bi-check-circle me-2"></i>
                    {message}
                </div>
            )}

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
                            Liste de mes candidatures
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
                                <option value="EN_ATTENTE">
                                    En attente
                                </option>
                                <option value="ACCEPTEE">
                                    Acceptée
                                </option>
                                <option value="REFUSEE">
                                    Refusée
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="card-body">
                    {currentCandidatures.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <i
                                className="bi bi-inbox d-block mb-3"
                                style={{
                                    fontSize: "48px",
                                }}
                            ></i>

                            Aucune candidature trouvée.
                        </div>
                    ) : (
                        <div className="row">
                            {currentCandidatures.map((c) => (
                                <div className="col-lg-6 mb-3" key={c.id}>
                                    <div className="card border-0 bg-light rounded-4 h-100">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div>
                                                    <h5 className="fw-bold mb-1">
                                                        #{c.id} - {c.domaineStage}
                                                    </h5>

                                                    <p className="text-muted small mb-0">
                                                        {c.sujetPropose}
                                                    </p>
                                                </div>

                                                <span className={`badge ${getBadgeClass(c.statut)}`}>
                          {c.statut || "EN_ATTENTE"}
                        </span>
                                            </div>

                                            <div className="border-top pt-3 mt-3">
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleDownload(c.id)}
                                                    disabled={downloadingId === c.id}
                                                >
                                                    {downloadingId === c.id ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                                            Téléchargement...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-download me-1"></i>
                                                            Télécharger CV
                                                        </>
                                                    )}
                                                </button>
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
                        totalItems={filteredList.length}
                        setCurrentPage={setCurrentPage}
                        setPageSize={setPageSize}
                    />
                </div>
            </div>
        </div>
    );
}