import React, { useEffect, useMemo, useState } from "react";

import {
    getAllRhCandidatures,
} from "../services/rhCandidatureService";

import {
    planifierEntretien,
    getAllEntretiens,
    terminerEntretien,
    annulerEntretien,
} from "../services/entretienService";

import Pagination from "../components/Pagination";

export default function RhEntretiensPage() {
    const [candidatures, setCandidatures] = useState([]);
    const [entretiens, setEntretiens] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState(null);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [search, setSearch] = useState("");
    const [statutFilter, setStatutFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [form, setForm] = useState({
        candidatureId: "",
        dateEntretien: "",
        heureEntretien: "",
        lieu: "",
        commentaire: "",
    });

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const candRes = await getAllRhCandidatures();
            const entRes = await getAllEntretiens();

            setCandidatures(
                (candRes.data || []).filter(
                    (c) => c.statut === "ACCEPTEE"
                )
            );

            setEntretiens(entRes.data || []);
        } catch (err) {
            console.error(err);
            setError("Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setForm({
            candidatureId: "",
            dateEntretien: "",
            heureEntretien: "",
            lieu: "",
            commentaire: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            setLoadingAction("create");

            await planifierEntretien(form);

            setMessage("Entretien planifié avec succès");

            resetForm();

            setShowForm(false);

            await loadData();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Erreur lors de la planification"
            );
        } finally {
            setLoadingAction(null);
        }
    };

    const handleTerminer = async (id) => {
        try {
            setLoadingAction(`finish-${id}`);

            await terminerEntretien(id);

            setMessage("Entretien terminé avec succès");

            await loadData();
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la mise à jour");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleAnnuler = async (id) => {
        try {
            setLoadingAction(`cancel-${id}`);

            await annulerEntretien(id);

            setMessage("Entretien annulé avec succès");

            await loadData();
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'annulation");
        } finally {
            setLoadingAction(null);
        }
    };

    const filteredEntretiens = useMemo(() => {
        return entretiens.filter((e) => {
            const text = `
        ${e.id || ""}
        ${e.nomCandidat || ""}
        ${e.prenomCandidat || ""}
        ${e.domaineStage || ""}
        ${e.sujetPropose || ""}
        ${e.dateEntretien || ""}
        ${e.heureEntretien || ""}
        ${e.lieu || ""}
        ${e.statut || ""}
      `.toLowerCase();

            const matchesSearch = text.includes(search.toLowerCase());

            const matchesStatus =
                !statutFilter || e.statut === statutFilter;

            return matchesSearch && matchesStatus;
        });
    }, [entretiens, search, statutFilter]);

    const totalPages = Math.ceil(
        filteredEntretiens.length / pageSize
    );

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

    if (loading) {
        return (
            <div className="container-fluid py-5 text-center">
                <div className="spinner-border text-primary"></div>

                <p className="text-muted mt-3">
                    Chargement des entretiens...
                </p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

                <div>
                    <h2 className="fw-bold mb-1">
                        Gestion des entretiens
                    </h2>

                    <p className="text-muted mb-0">
                        Planifiez et gérez les entretiens RH.
                    </p>
                </div>

                <div className="d-flex gap-2">

                    <button
                        className="btn btn-outline-primary"
                        onClick={loadData}
                    >
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        Actualiser
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        <i className="bi bi-plus-circle me-1"></i>

                        {showForm
                            ? "Fermer"
                            : "Planifier entretien"}
                    </button>

                </div>

            </div>

            <div className="row mb-4">

                <div className="col-lg-4 col-md-6 mb-3">

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
                                    Terminés
                                </p>

                                <h3 className="fw-bold text-success mb-0">
                                    {totalTermines}
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
                                    Annulés
                                </p>

                                <h3 className="fw-bold text-danger mb-0">
                                    {totalAnnules}
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

            {showForm && (
                <div className="card border-0 shadow-sm rounded-4 mb-4">

                    <div className="card-header bg-white border-0 py-3 px-4">
                        <h5 className="fw-bold mb-0">
                            Planifier un entretien
                        </h5>
                    </div>

                    <div className="card-body p-4">

                        <form onSubmit={handleSubmit}>

                            <div className="row">

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Candidature acceptée
                                    </label>

                                    <select
                                        name="candidatureId"
                                        className="form-select"
                                        value={form.candidatureId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">
                                            -- Choisir --
                                        </option>

                                        {candidatures.map((c) => (
                                            <option
                                                key={c.id}
                                                value={c.id}
                                            >
                                                #{c.id} - {c.domaineStage} -{" "}
                                                {c.sujetPropose}
                                            </option>
                                        ))}

                                    </select>

                                </div>

                                <div className="col-md-3 mb-3">

                                    <label className="form-label">
                                        Date
                                    </label>

                                    <input
                                        type="date"
                                        name="dateEntretien"
                                        className="form-control"
                                        value={form.dateEntretien}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="col-md-3 mb-3">

                                    <label className="form-label">
                                        Heure
                                    </label>

                                    <input
                                        type="time"
                                        name="heureEntretien"
                                        className="form-control"
                                        value={form.heureEntretien}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="col-md-12 mb-3">

                                    <label className="form-label">
                                        Lieu / lien Meet
                                    </label>

                                    <input
                                        type="text"
                                        name="lieu"
                                        className="form-control"
                                        value={form.lieu}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="col-md-12 mb-3">

                                    <label className="form-label">
                                        Commentaire
                                    </label>

                                    <textarea
                                        name="commentaire"
                                        className="form-control"
                                        rows="4"
                                        value={form.commentaire}
                                        onChange={handleChange}
                                    ></textarea>

                                </div>

                            </div>

                            <div className="d-flex justify-content-end">

                                <button
                                    className="btn btn-primary px-4"
                                    disabled={loadingAction === "create"}
                                >

                                    {loadingAction === "create" ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Planification...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-calendar-plus me-1"></i>
                                            Planifier
                                        </>
                                    )}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

            <div className="card border-0 shadow-sm rounded-4">

                <div className="card-header bg-white border-0 py-3 px-4">

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

                        <h5 className="fw-bold mb-0">
                            Liste des entretiens
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

                    <div className="table-responsive">

                        <table className="table align-middle">

                            <thead className="table-light">

                            <tr>
                                <th>ID</th>
                                <th>Candidat</th>
                                <th>Domaine</th>
                                <th>Sujet</th>
                                <th>Date</th>
                                <th>Heure</th>
                                <th>Lieu</th>
                                <th>Statut</th>
                                <th className="text-end">
                                    Actions
                                </th>
                            </tr>

                            </thead>

                            <tbody>

                            {currentEntretiens.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="9"
                                        className="text-center py-5 text-muted"
                                    >
                                        <i
                                            className="bi bi-inbox d-block mb-3"
                                            style={{
                                                fontSize: "44px",
                                            }}
                                        ></i>

                                        Aucun entretien trouvé
                                    </td>
                                </tr>

                            ) : (

                                currentEntretiens.map((e) => (

                                    <tr key={e.id}>

                                        <td>
                        <span className="fw-semibold">
                          #{e.id}
                        </span>
                                        </td>

                                        <td>
                                            <div className="fw-semibold">
                                                {e.nomCandidat}{" "}
                                                {e.prenomCandidat}
                                            </div>
                                        </td>

                                        <td>{e.domaineStage}</td>

                                        <td>
                        <span
                            className="d-inline-block text-truncate"
                            style={{
                                maxWidth: "220px",
                            }}
                            title={e.sujetPropose}
                        >
                          {e.sujetPropose}
                        </span>
                                        </td>

                                        <td>{e.dateEntretien}</td>

                                        <td>{e.heureEntretien}</td>

                                        <td>
                        <span
                            className="d-inline-block text-truncate"
                            style={{
                                maxWidth: "180px",
                            }}
                            title={e.lieu}
                        >
                          {e.lieu}
                        </span>
                                        </td>

                                        <td>
                        <span
                            className={`badge ${getBadgeClass(
                                e.statut
                            )}`}
                        >
                          {e.statut}
                        </span>
                                        </td>

                                        <td>

                                            <div className="d-flex justify-content-end gap-2">

                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={() =>
                                                        handleTerminer(e.id)
                                                    }
                                                    disabled={
                                                        loadingAction ===
                                                        `finish-${e.id}` ||
                                                        e.statut === "TERMINE"
                                                    }
                                                >

                                                    {loadingAction ===
                                                    `finish-${e.id}` ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-1"></span>
                                                            ...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-check-circle me-1"></i>
                                                            Terminer
                                                        </>
                                                    )}

                                                </button>

                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() =>
                                                        handleAnnuler(e.id)
                                                    }
                                                    disabled={
                                                        loadingAction ===
                                                        `cancel-${e.id}` ||
                                                        e.statut === "ANNULE"
                                                    }
                                                >

                                                    {loadingAction ===
                                                    `cancel-${e.id}` ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-1"></span>
                                                            ...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-x-circle me-1"></i>
                                                            Annuler
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
                        totalItems={filteredEntretiens.length}
                        setCurrentPage={setCurrentPage}
                        setPageSize={setPageSize}
                    />

                </div>

            </div>

        </div>
    );
}