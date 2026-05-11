import React, { useEffect, useMemo, useState } from "react";
import {
    getLivrablesEncadrant,
    validerLivrableEncadrant,
    rejeterLivrableEncadrant,
    downloadLivrable,
} from "../services/livrableService";

import Pagination from "../components/Pagination";

export default function EncadrantLivrablesPage() {
    const [livrables, setLivrables] = useState([]);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statutFilter, setStatutFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [showModal, setShowModal] = useState(false);
    const [selectedLivrable, setSelectedLivrable] = useState(null);
    const [actionType, setActionType] = useState("");
    const [remarque, setRemarque] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await getLivrablesEncadrant();
            setLivrables(res.data || []);
        } catch (err) {
            console.error(err);
            setError("Erreur lors du chargement des livrables");
        } finally {
            setLoading(false);
        }
    };

    const openActionModal = (livrable, type) => {
        setSelectedLivrable(livrable);
        setActionType(type);
        setRemarque("");
        setShowModal(true);
        setMessage("");
        setError("");
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedLivrable(null);
        setActionType("");
        setRemarque("");
    };

    const confirmAction = async () => {
        if (!selectedLivrable) {
            return;
        }

        if (actionType === "REJETER" && !remarque.trim()) {
            setError("Le motif du rejet est obligatoire");
            return;
        }

        try {
            setProcessing(true);
            setError("");
            setMessage("");

            if (actionType === "VALIDER") {
                await validerLivrableEncadrant(selectedLivrable.id, remarque.trim());
                setMessage("Livrable validé avec succès");
            }

            if (actionType === "REJETER") {
                await rejeterLivrableEncadrant(selectedLivrable.id, remarque.trim());
                setMessage("Livrable rejeté avec succès");
            }

            closeModal();
            await loadData();
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || "Erreur lors du traitement du livrable"
            );
        } finally {
            setProcessing(false);
        }
    };

    const handleDownload = async (id) => {
        try {
            setError("");
            await downloadLivrable(id);
        } catch (err) {
            console.error(err);
            setError("Erreur lors du téléchargement du fichier");
        }
    };

    const filteredLivrables = useMemo(() => {
        return livrables.filter((l) => {
            const text = `
        ${l.id}
        ${l.nomCandidat || ""}
        ${l.prenomCandidat || ""}
        ${l.sujetFinal || ""}
        ${l.titre || ""}
        ${l.statut || ""}
        ${l.remarque || ""}
      `.toLowerCase();

            const matchesSearch = text.includes(search.toLowerCase());

            const matchesStatus =
                !statutFilter || l.statut === statutFilter;

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

                <p className="text-muted mt-3">
                    Chargement des livrables...
                </p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">
                        Livrables de mes stagiaires
                    </h2>

                    <p className="text-muted mb-0">
                        Consultez, téléchargez, validez ou rejetez les livrables déposés.
                    </p>
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-lg-3 col-md-6 mb-3">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <p className="text-muted mb-1">
                                    Total livrables
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
                                <i className="bi bi-folder2-open"></i>
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
                        <div>
                            <h5 className="fw-bold mb-0">
                                Liste des livrables
                            </h5>
                        </div>

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
                                <th>Candidat</th>
                                <th>Stage</th>
                                <th>Titre</th>
                                <th>Date</th>
                                <th>Statut</th>
                                <th>Remarque</th>
                                <th>Fichier</th>
                                <th className="text-end">Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {currentLivrables.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="9"
                                        className="text-center py-4 text-muted"
                                    >
                                        Aucun livrable trouvé
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
                                            <div className="fw-semibold">
                                                {l.nomCandidat} {l.prenomCandidat}
                                            </div>
                                        </td>

                                        <td>
                        <span
                            className="d-inline-block text-truncate"
                            style={{
                                maxWidth: "180px",
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
                        <span
                            className={`badge ${getBadgeClass(l.statut)}`}
                        >
                          {l.statut}
                        </span>
                                        </td>

                                        <td>
                        <span
                            className="d-inline-block text-truncate"
                            style={{
                                maxWidth: "180px",
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
                                            >
                                                <i className="bi bi-download me-1"></i>
                                                Télécharger
                                            </button>
                                        </td>

                                        <td className="text-end">
                                            <button
                                                className="btn btn-sm btn-success me-2"
                                                onClick={() => openActionModal(l, "VALIDER")}
                                                disabled={l.statut === "VALIDE" || processing}
                                            >
                                                <i className="bi bi-check-circle me-1"></i>
                                                Valider
                                            </button>

                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => openActionModal(l, "REJETER")}
                                                disabled={l.statut === "REJETE" || processing}
                                            >
                                                <i className="bi bi-x-circle me-1"></i>
                                                Rejeter
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

            {showModal && (
                <div
                    className="modal fade show"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.45)",
                    }}
                    tabIndex="-1"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 shadow">
                            <div className="modal-header border-0">
                                <h5 className="modal-title fw-bold">
                                    {actionType === "VALIDER"
                                        ? "Valider le livrable"
                                        : "Rejeter le livrable"}
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeModal}
                                    disabled={processing}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <p className="text-muted">
                                    Livrable sélectionné :{" "}
                                    <strong>
                                        {selectedLivrable?.titre}
                                    </strong>
                                </p>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">
                                        {actionType === "VALIDER"
                                            ? "Remarque"
                                            : "Motif du rejet"}
                                        {actionType === "REJETER" && (
                                            <span className="text-danger"> *</span>
                                        )}
                                    </label>

                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        value={remarque}
                                        onChange={(e) => setRemarque(e.target.value)}
                                        placeholder={
                                            actionType === "VALIDER"
                                                ? "Remarque optionnelle..."
                                                : "Expliquez le motif du rejet..."
                                        }
                                    ></textarea>
                                </div>
                            </div>

                            <div className="modal-footer border-0">
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={closeModal}
                                    disabled={processing}
                                >
                                    Annuler
                                </button>

                                <button
                                    className={
                                        actionType === "VALIDER"
                                            ? "btn btn-success"
                                            : "btn btn-danger"
                                    }
                                    onClick={confirmAction}
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Traitement...
                                        </>
                                    ) : actionType === "VALIDER" ? (
                                        <>
                                            <i className="bi bi-check-circle me-1"></i>
                                            Confirmer validation
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-x-circle me-1"></i>
                                            Confirmer rejet
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}