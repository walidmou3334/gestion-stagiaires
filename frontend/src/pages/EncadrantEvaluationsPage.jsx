import React, { useEffect, useMemo, useState } from "react";

import { getStagesEncadrant } from "../services/encadrantStageService";

import {
    creerEvaluation,
    getEvaluationsEncadrant,
} from "../services/evaluationService";

import Pagination from "../components/Pagination";

export default function EncadrantEvaluationsPage() {
    const [stages, setStages] = useState([]);
    const [evaluations, setEvaluations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [form, setForm] = useState({
        stageId: "",
        note: "",
        appreciation: "",
        statut: "VALIDE",
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);

            const stagesRes = await getStagesEncadrant();
            const evalRes = await getEvaluationsEncadrant();

            setStages(stagesRes.data || []);
            setEvaluations(evalRes.data || []);
        } catch (err) {
            console.error(err);
            setError("Erreur lors du chargement");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const resetForm = () => {
        setForm({
            stageId: "",
            note: "",
            appreciation: "",
            statut: "VALIDE",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!form.stageId) {
            setError("Veuillez choisir un stage");
            return;
        }

        if (!form.note) {
            setError("La note est obligatoire");
            return;
        }

        if (Number(form.note) < 0 || Number(form.note) > 20) {
            setError("La note doit être entre 0 et 20");
            return;
        }

        if (!form.appreciation.trim()) {
            setError("L'appréciation est obligatoire");
            return;
        }

        try {
            setSaving(true);

            await creerEvaluation({
                stageId: form.stageId,
                note: Number(form.note),
                appreciation: form.appreciation.trim(),
                statut: form.statut,
            });

            setMessage("Évaluation enregistrée avec succès");

            resetForm();

            await loadData();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Erreur lors de l'évaluation"
            );
        } finally {
            setSaving(false);
        }
    };

    const filteredEvaluations = useMemo(() => {
        return evaluations.filter((e) => {
            const text =
                `${e.nomCandidat} ${e.prenomCandidat} ${e.sujetFinal}`
                    .toLowerCase();

            return text.includes(search.toLowerCase());
        });
    }, [evaluations, search]);

    const totalPages = Math.ceil(
        filteredEvaluations.length / pageSize
    );

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

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="fw-bold mb-1">
                        Évaluations des stagiaires
                    </h2>

                    <p className="text-muted mb-0">
                        Gestion et suivi des évaluations
                    </p>
                </div>

            </div>

            <div className="row mb-4">

                <div className="col-lg-4 mb-3">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

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
                </div>

                <div className="col-lg-4 mb-3">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

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
                </div>

                <div className="col-lg-4 mb-3">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body">

                            <div className="d-flex justify-content-between align-items-center">

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

            <div className="card border-0 shadow-sm rounded-4 mb-4">

                <div className="card-header bg-white border-0 py-3 px-4">
                    <h5 className="fw-bold mb-0">
                        Nouvelle évaluation
                    </h5>
                </div>

                <div className="card-body">

                    <form onSubmit={handleSubmit}>

                        <div className="row">

                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-semibold">
                                    Stage
                                </label>

                                <select
                                    name="stageId"
                                    className="form-select"
                                    value={form.stageId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        -- Choisir stage --
                                    </option>

                                    {stages.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            #{s.id} - {s.nomCandidat}{" "}
                                            {s.prenomCandidat} - {s.sujetFinal}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label fw-semibold">
                                    Note /20
                                </label>

                                <input
                                    type="number"
                                    name="note"
                                    className="form-control"
                                    value={form.note}
                                    min="0"
                                    max="20"
                                    step="0.5"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-3 mb-3">
                                <label className="form-label fw-semibold">
                                    Résultat
                                </label>

                                <select
                                    name="statut"
                                    className="form-select"
                                    value={form.statut}
                                    onChange={handleChange}
                                >
                                    <option value="VALIDE">
                                        VALIDE
                                    </option>

                                    <option value="NON_VALIDE">
                                        NON VALIDE
                                    </option>
                                </select>
                            </div>

                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold">
                                Appréciation
                            </label>

                            <textarea
                                name="appreciation"
                                className="form-control"
                                rows="4"
                                value={form.appreciation}
                                onChange={handleChange}
                                placeholder="Ajoutez votre appréciation..."
                                required
                            ></textarea>
                        </div>

                        <div className="d-flex justify-content-end gap-2">

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={resetForm}
                                disabled={saving}
                            >
                                Réinitialiser
                            </button>

                            <button
                                className="btn btn-primary px-4"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-save me-2"></i>
                                        Enregistrer
                                    </>
                                )}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

            <div className="card border-0 shadow-sm rounded-4">

                <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center flex-wrap gap-3">

                    <h5 className="fw-bold mb-0">
                        Mes évaluations
                    </h5>

                    <div style={{ width: "300px" }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Rechercher..."
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                </div>

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table align-middle">

                            <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Stagiaire</th>
                                <th>Stage</th>
                                <th>Note</th>
                                <th>Statut</th>
                                <th>Appréciation</th>
                            </tr>
                            </thead>

                            <tbody>

                            {currentEvaluations.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-muted">
                                        Aucune évaluation trouvée
                                    </td>
                                </tr>
                            ) : (
                                currentEvaluations.map((e) => (
                                    <tr key={e.id}>

                                        <td>
                        <span className="fw-semibold">
                          #{e.id}
                        </span>
                                        </td>

                                        <td>
                                            <div className="fw-semibold">
                                                {e.nomCandidat} {e.prenomCandidat}
                                            </div>
                                        </td>

                                        <td>
                                            {e.sujetFinal}
                                        </td>

                                        <td>
                        <span className="badge bg-primary">
                          {e.note}/20
                        </span>
                                        </td>

                                        <td>
                        <span
                            className={`badge ${
                                e.statut === "VALIDE"
                                    ? "bg-success"
                                    : "bg-danger"
                            }`}
                        >
                          {e.statut}
                        </span>
                                        </td>

                                        <td style={{ maxWidth: "300px" }}>
                                            <div
                                                className="text-truncate"
                                                title={e.appreciation}
                                            >
                                                {e.appreciation}
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
                        totalItems={filteredEvaluations.length}
                        setCurrentPage={setCurrentPage}
                        setPageSize={setPageSize}
                    />

                </div>

            </div>

        </div>
    );
}