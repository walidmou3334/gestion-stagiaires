import React, { useEffect, useMemo, useState } from "react";

import { getAllRhCandidatures } from "../services/rhCandidatureService";
import { getEncadrants } from "../services/encadrantService";

import {
    affecterStage,
    getAllStages,
    terminerStage,
    annulerStage,
} from "../services/stageService";

import Pagination from "../components/Pagination";

export default function RhStagesPage() {
    const [candidatures, setCandidatures] = useState([]);
    const [encadrants, setEncadrants] = useState([]);
    const [stages, setStages] = useState([]);

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
        encadrantId: "",
        sujetFinal: "",
        service: "",
        dateDebut: "",
        dateFin: "",
    });

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const candRes = await getAllRhCandidatures();
            const encRes = await getEncadrants();
            const stageRes = await getAllStages();

            setCandidatures(
                (candRes.data || []).filter(
                    (c) => c.statut === "ACCEPTEE"
                )
            );

            setEncadrants(encRes.data || []);
            setStages(stageRes.data || []);
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
            encadrantId: "",
            sujetFinal: "",
            service: "",
            dateDebut: "",
            dateFin: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoadingAction("create");
            setError("");
            setMessage("");

            await affecterStage(form);

            setMessage("Stage affecté avec succès");

            resetForm();
            setShowForm(false);

            await loadData();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Erreur lors de l'affectation"
            );
        } finally {
            setLoadingAction(null);
        }
    };

    const handleTerminer = async (id) => {
        try {
            setLoadingAction(`finish-${id}`);

            await terminerStage(id);

            setMessage("Stage terminé avec succès");

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

            await annulerStage(id);

            setMessage("Stage annulé avec succès");

            await loadData();
        } catch (err) {
            console.error(err);
            setError("Erreur lors de l'annulation");
        } finally {
            setLoadingAction(null);
        }
    };

    const filteredStages = useMemo(() => {
        return stages.filter((s) => {
            const text = `
        ${s.id || ""}
        ${s.nomCandidat || ""}
        ${s.prenomCandidat || ""}
        ${s.sujetFinal || ""}
        ${s.nomEncadrant || ""}
        ${s.prenomEncadrant || ""}
        ${s.service || ""}
        ${s.statut || ""}
      `.toLowerCase();

            const matchesSearch = text.includes(search.toLowerCase());

            const matchesStatus =
                !statutFilter || s.statut === statutFilter;

            return matchesSearch && matchesStatus;
        });
    }, [stages, search, statutFilter]);

    const totalPages = Math.ceil(
        filteredStages.length / pageSize
    );

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

    if (loading) {
        return (
            <div className="container-fluid py-5 text-center">
                <div className="spinner-border text-primary"></div>

                <p className="text-muted mt-3">
                    Chargement des stages...
                </p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">

            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

                <div>
                    <h2 className="fw-bold mb-1">
                        Affectation des stages
                    </h2>

                    <p className="text-muted mb-0">
                        Gérez les affectations et le suivi des stages.
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
                            : "Nouvelle affectation"}
                    </button>

                </div>

            </div>

            <div className="row mb-4">

                <div className="col-lg-4 col-md-6 mb-3">

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
                            Nouvelle affectation
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
                                        className="form-select"
                                        name="candidatureId"
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

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Encadrant
                                    </label>

                                    <select
                                        className="form-select"
                                        name="encadrantId"
                                        value={form.encadrantId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">
                                            -- Choisir --
                                        </option>

                                        {encadrants.map((e) => (
                                            <option
                                                key={e.id}
                                                value={e.id}
                                            >
                                                {e.nom} {e.prenom} -{" "}
                                                {e.specialite}
                                            </option>
                                        ))}

                                    </select>

                                </div>

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Sujet final
                                    </label>

                                    <input
                                        className="form-control"
                                        name="sujetFinal"
                                        value={form.sujetFinal}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Service
                                    </label>

                                    <input
                                        className="form-control"
                                        name="service"
                                        value={form.service}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Date début
                                    </label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        name="dateDebut"
                                        value={form.dateDebut}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                                <div className="col-md-6 mb-3">

                                    <label className="form-label">
                                        Date fin
                                    </label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        name="dateFin"
                                        value={form.dateFin}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                            <div className="d-flex justify-content-end mt-3">

                                <button
                                    className="btn btn-primary px-4"
                                    disabled={loadingAction === "create"}
                                >

                                    {loadingAction === "create" ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Affectation...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-circle me-1"></i>
                                            Affecter
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
                            Stages affectés
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

                    <div className="table-responsive">

                        <table className="table align-middle">

                            <thead className="table-light">

                            <tr>
                                <th>ID</th>
                                <th>Candidat</th>
                                <th>Sujet</th>
                                <th>Encadrant</th>
                                <th>Service</th>
                                <th>Période</th>
                                <th>Statut</th>
                                <th className="text-end">
                                    Actions
                                </th>
                            </tr>

                            </thead>

                            <tbody>

                            {currentStages.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="8"
                                        className="text-center py-5 text-muted"
                                    >
                                        <i
                                            className="bi bi-inbox d-block mb-3"
                                            style={{
                                                fontSize: "44px",
                                            }}
                                        ></i>

                                        Aucun stage affecté
                                    </td>
                                </tr>

                            ) : (

                                currentStages.map((s) => (

                                    <tr key={s.id}>

                                        <td>
                        <span className="fw-semibold">
                          #{s.id}
                        </span>
                                        </td>

                                        <td>
                                            <div className="fw-semibold">
                                                {s.nomCandidat}{" "}
                                                {s.prenomCandidat}
                                            </div>
                                        </td>

                                        <td>
                        <span
                            className="d-inline-block text-truncate"
                            style={{
                                maxWidth: "220px",
                            }}
                            title={s.sujetFinal}
                        >
                          {s.sujetFinal}
                        </span>
                                        </td>

                                        <td>
                                            {s.nomEncadrant}{" "}
                                            {s.prenomEncadrant}
                                        </td>

                                        <td>
                        <span className="badge bg-primary">
                          {s.service}
                        </span>
                                        </td>

                                        <td>
                                            <div className="small">
                                                <div>
                                                    <strong>Début:</strong>{" "}
                                                    {s.dateDebut}
                                                </div>

                                                <div>
                                                    <strong>Fin:</strong>{" "}
                                                    {s.dateFin}
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                        <span
                            className={`badge ${getBadgeClass(
                                s.statut
                            )}`}
                        >
                          {s.statut}
                        </span>
                                        </td>

                                        <td>

                                            <div className="d-flex justify-content-end gap-2">

                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={() =>
                                                        handleTerminer(s.id)
                                                    }
                                                    disabled={
                                                        loadingAction ===
                                                        `finish-${s.id}` ||
                                                        s.statut === "TERMINE"
                                                    }
                                                >

                                                    {loadingAction ===
                                                    `finish-${s.id}` ? (
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
                                                        handleAnnuler(s.id)
                                                    }
                                                    disabled={
                                                        loadingAction ===
                                                        `cancel-${s.id}` ||
                                                        s.statut === "ANNULE"
                                                    }
                                                >

                                                    {loadingAction ===
                                                    `cancel-${s.id}` ? (
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
                        totalItems={filteredStages.length}
                        setCurrentPage={setCurrentPage}
                        setPageSize={setPageSize}
                    />

                </div>

            </div>

        </div>
    );
}