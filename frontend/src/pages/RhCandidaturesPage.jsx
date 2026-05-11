import React, { useEffect, useMemo, useState } from "react";
import {
    getAllRhCandidatures,
    accepterCandidature,
    refuserCandidature,
} from "../services/rhCandidatureService";

import { downloadCv } from "../services/candidatureService";

import Pagination from "../components/Pagination";

export default function RhCandidaturesPage() {
    const [candidatures, setCandidatures] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statutFilter, setStatutFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getAllRhCandidatures();

            setCandidatures(response.data || []);
        } catch (err) {
            console.error(err);
            setError("Erreur lors du chargement des candidatures");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAccepter = async (id) => {
        try {
            setLoadingAction(`accept-${id}`);
            setMessage("");
            setError("");

            await accepterCandidature(id);

            setMessage("Candidature acceptée avec succès");

            await loadData();
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'acceptation");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleRefuser = async (id) => {
        try {
            setLoadingAction(`refuse-${id}`);
            setMessage("");
            setError("");

            await refuserCandidature(id);

            setMessage("Candidature refusée avec succès");

            await loadData();
        } catch (err) {
            console.error(err);
            setError("Erreur lors du refus");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleDownloadCv = async (id) => {
        try {
            setLoadingAction(`cv-${id}`);
            setError("");

            await downloadCv(id);

            setMessage("Téléchargement du CV lancé");
        } catch (err) {
            console.error(err);
            setError("Erreur lors du téléchargement du CV");
        } finally {
            setLoadingAction(null);
        }
    };

    const filteredCandidatures = useMemo(() => {
        return candidatures.filter((item) => {
            const text = `
        ${item.id || ""}
        ${item.dateCandidature || ""}
        ${item.domaineStage || ""}
        ${item.sujetPropose || ""}
        ${item.statut || ""}
      `.toLowerCase();

            const matchesSearch = text.includes(search.toLowerCase());

            const matchesStatus =
                !statutFilter || item.statut === statutFilter;

            return matchesSearch && matchesStatus;
        });
    }, [candidatures, search, statutFilter]);

    const totalPages = Math.ceil(
        filteredCandidatures.length / pageSize
    );

    const currentCandidatures = filteredCandidatures.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const totalEnAttente = candidatures.filter(
        (c) => c.statut === "EN_ATTENTE"
    ).length;

    const totalAcceptees = candidatures.filter(
        (c) => c.statut === "ACCEPTEE"
    ).length;

    const totalRefusees = candidatures.filter(
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

                <p className="text-muted mt-3">
                    Chargement des candidatures...
                </p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

                <div>
                    <h2 className="fw-bold mb-1">
                        Gestion des candidatures RH
                    </h2>

                    <p className="text-muted mb-0">
                        Gérez les candidatures et les décisions RH.
                    </p>
                </div>

                <button
                    className="btn btn-outline-primary"
                    onClick={loadData}
                >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    Actualiser
                </button>

            </div>

            <div className="row mb-4">

                <div className="col-lg-4 col-md-6 mb-3">
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
                                className="rounded-circle bg-warning bg-opacity-10 text-warning
                d-flex justify-content-center align-items-center"
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

                <div className="col-lg-4 col-md-6 mb-3">
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

                <div className="col-lg-4 col-md-6 mb-3">
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
                            Liste des candidatures
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

                    <div className="table-responsive">

                        <table className="table align-middle">

                            <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Domaine</th>
                                <th>Sujet</th>
                                <th>Statut</th>
                                <th>CV</th>
                                <th className="text-end">
                                    Actions
                                </th>
                            </tr>
                            </thead>

                            <tbody>

                            {currentCandidatures.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center py-5 text-muted"
                                    >
                                        <i
                                            className="bi bi-inbox d-block mb-3"
                                            style={{
                                                fontSize: "44px",
                                            }}
                                        ></i>

                                        Aucune candidature trouvée.
                                    </td>
                                </tr>

                            ) : (

                                currentCandidatures.map((item) => (

                                    <tr key={item.id}>

                                        <td>
                        <span className="fw-semibold">
                          #{item.id}
                        </span>
                                        </td>

                                        <td>
                                            {item.dateCandidature || "-"}
                                        </td>

                                        <td>
                        <span className="fw-semibold">
                          {item.domaineStage || "-"}
                        </span>
                                        </td>

                                        <td>
                        <span
                            className="d-inline-block text-truncate"
                            style={{
                                maxWidth: "250px",
                            }}
                            title={item.sujetPropose}
                        >
                          {item.sujetPropose || "-"}
                        </span>
                                        </td>

                                        <td>
                        <span
                            className={`badge ${getBadgeClass(
                                item.statut
                            )}`}
                        >
                          {item.statut}
                        </span>
                                        </td>

                                        <td>

                                            <button
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() =>
                                                    handleDownloadCv(item.id)
                                                }
                                                disabled={
                                                    loadingAction === `cv-${item.id}`
                                                }
                                            >

                                                {loadingAction === `cv-${item.id}` ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                                        ...
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="bi bi-download me-1"></i>
                                                        Télécharger
                                                    </>
                                                )}

                                            </button>

                                        </td>

                                        <td>

                                            <div className="d-flex justify-content-end gap-2">

                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={() =>
                                                        handleAccepter(item.id)
                                                    }
                                                    disabled={
                                                        loadingAction === `accept-${item.id}` ||
                                                        item.statut === "ACCEPTEE"
                                                    }
                                                >

                                                    {loadingAction ===
                                                    `accept-${item.id}` ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-1"></span>
                                                            ...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-check-circle me-1"></i>
                                                            Accepter
                                                        </>
                                                    )}

                                                </button>

                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() =>
                                                        handleRefuser(item.id)
                                                    }
                                                    disabled={
                                                        loadingAction === `refuse-${item.id}` ||
                                                        item.statut === "REFUSEE"
                                                    }
                                                >

                                                    {loadingAction ===
                                                    `refuse-${item.id}` ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-1"></span>
                                                            ...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-x-circle me-1"></i>
                                                            Refuser
                                                        </>
                                                    )}

                                                </button>

                                            </div>

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
                        totalItems={filteredCandidatures.length}
                        setCurrentPage={setCurrentPage}
                        setPageSize={setPageSize}
                    />

                </div>

            </div>

        </div>
    );
}