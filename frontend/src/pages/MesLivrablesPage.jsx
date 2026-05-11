import React, { useEffect, useMemo, useState } from "react";
import {
    getMesLivrables,
    downloadLivrable,
} from "../services/livrableService";
import Pagination from "../components/Pagination";

export default function MesLivrablesPage() {
    const [livrables, setLivrables] = useState([]);

    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [search, setSearch] = useState("");
    const [statutFilter, setStatutFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        loadLivrables();
    }, []);

    const loadLivrables = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await getMesLivrables();
            setLivrables(res.data || []);
        } catch (err) {
            console.error(err);
            setError("Erreur lors du chargement de vos livrables");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (id) => {
        try {
            setDownloadingId(id);
            setError("");
            setMessage("");

            await downloadLivrable(id);

            setMessage("Téléchargement lancé avec succès");
        } catch (err) {
            console.error(err);
            setError("Erreur lors du téléchargement du livrable");
        } finally {
            setDownloadingId(null);
        }
    };

    const filteredLivrables = useMemo(() => {
        return livrables.filter((l) => {
            const text = `
        ${l.id || ""}
        ${l.sujetFinal || ""}
        ${l.titre || ""}
        ${l.dateDepot || ""}
        ${l.statut || ""}
        ${l.remarque || ""}
      `.toLowerCase();

            const matchesSearch = text.includes(search.toLowerCase());
            const matchesStatus = !statutFilter || l.statut === statutFilter;

            return matchesSearch && matchesStatus;
        });
    }, [livrables, search, statutFilter]);

    const totalPages = Math.ceil(filteredLivrables.length / pageSize);

    const currentLivrables = filteredLivrables.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const totalEnAttente = livrables.filter(
        (l) => l.statut === "EN_ATTENTE"
    ).length;

    const totalValides = livrables.filter(
        (l) => l.statut === "VALIDE"
    ).length;

    const totalRejetes = livrables.filter(
        (l) => l.statut === "REJETE"
    ).length;

    const getBadgeClass = (statut) => {
        if (statut === "VALIDE") {
            return "bg-success";
        }

        if (statut === "REJETE") {
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
                    Chargement de vos livrables...
                </p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h2 className="fw-bold mb-1">
                        Mes livrables
                    </h2>

                    <p className="text-muted mb-0">
                        Consultez vos livrables déposés et leurs statuts.
                    </p>
                </div>

                <button
                    className="btn btn-outline-primary"
                    onClick={loadLivrables}
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
                                    {livrables.length}
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
                                <i className="bi bi-folder"></i>
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
                                    Validés
                                </p>

                                <h3 className="fw-bold text-success mb-0">
                                    {totalValides}
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
                                    Rejetés
                                </p>

                                <h3 className="fw-bold text-danger mb-0">
                                    {totalRejetes}
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
                            Liste de mes livrables
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

                                <option value="VALIDE">
                                    Validé
                                </option>

                                <option value="REJETE">
                                    Rejeté
                                </option>
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
                                <th>Stage</th>
                                <th>Titre</th>
                                <th>Date dépôt</th>
                                <th>Statut</th>
                                <th>Remarque</th>
                                <th>Fichier</th>
                            </tr>
                            </thead>

                            <tbody>
                            {currentLivrables.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">
                                        <i
                                            className="bi bi-inbox d-block mb-3"
                                            style={{
                                                fontSize: "44px",
                                            }}
                                        ></i>
                                        Aucun livrable trouvé.
                                    </td>
                                </tr>
                            ) : (
                                currentLivrables.map((l) => (
                                    <tr key={l.id}>
                                        <td>
                        <span className="fw-semibold">
                          #{l.id}
                        </span>
                                        </td>

                                        <td>
                        <span
                            className="d-inline-block text-truncate"
                            style={{
                                maxWidth: "240px",
                            }}
                            title={l.sujetFinal}
                        >
                          {l.sujetFinal || "-"}
                        </span>
                                        </td>

                                        <td>
                        <span className="fw-semibold">
                          {l.titre || "-"}
                        </span>
                                        </td>

                                        <td>
                                            {l.dateDepot || "-"}
                                        </td>

                                        <td>
                        <span className={`badge ${getBadgeClass(l.statut)}`}>
                          {l.statut || "-"}
                        </span>
                                        </td>

                                        <td>
                        <span
                            className="d-inline-block text-truncate"
                            style={{
                                maxWidth: "220px",
                            }}
                            title={l.remarque || ""}
                        >
                          {l.remarque || "-"}
                        </span>
                                        </td>

                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => handleDownload(l.id)}
                                                disabled={downloadingId === l.id}
                                            >
                                                {downloadingId === l.id ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        Téléchargement...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-download me-1"></i>
                                                        Télécharger
                                                    </>
                                                )}
                                            </button>
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
                        totalItems={filteredLivrables.length}
                        setCurrentPage={setCurrentPage}
                        setPageSize={setPageSize}
                    />
                </div>
            </div>
        </div>
    );
}