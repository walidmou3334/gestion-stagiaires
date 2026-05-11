import React, { useEffect, useMemo, useState } from "react";

import {
    getEncadrants,
    createEncadrant,
    deleteEncadrant,
} from "../services/encadrantService";

import Pagination from "../components/Pagination";

export default function RhEncadrantsPage() {
    const [encadrants, setEncadrants] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState(null);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [search, setSearch] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        nom: "",
        prenom: "",
        matricule: "",
        email: "",
        telephone: "",
        service: "",
        specialite: "",
        username: "",
        motDePasse: "",
    });

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await getEncadrants();

            setEncadrants(res.data || []);
        } catch (err) {
            console.error(err);
            setError("Erreur lors du chargement des encadrants");
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
            nom: "",
            prenom: "",
            matricule: "",
            email: "",
            telephone: "",
            service: "",
            specialite: "",
            username: "",
            motDePasse: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        try {
            setLoadingAction("create");

            await createEncadrant(form);

            setMessage("Encadrant créé avec succès");

            resetForm();

            setShowForm(false);

            await loadData();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Erreur lors de la création de l'encadrant"
            );
        } finally {
            setLoadingAction(null);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Supprimer cet encadrant ?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setLoadingAction(`delete-${id}`);

            await deleteEncadrant(id);

            setMessage("Encadrant supprimé avec succès");

            await loadData();
        } catch (err) {
            console.error(err);
            setError("Erreur lors de la suppression");
        } finally {
            setLoadingAction(null);
        }
    };

    const filteredEncadrants = useMemo(() => {
        return encadrants.filter((e) => {
            const text = `
        ${e.id || ""}
        ${e.nom || ""}
        ${e.prenom || ""}
        ${e.email || ""}
        ${e.matricule || ""}
        ${e.service || ""}
        ${e.specialite || ""}
      `.toLowerCase();

            return text.includes(search.toLowerCase());
        });
    }, [encadrants, search]);

    const totalPages = Math.ceil(
        filteredEncadrants.length / pageSize
    );

    const currentEncadrants = filteredEncadrants.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    if (loading) {
        return (
            <div className="container-fluid py-5 text-center">
                <div className="spinner-border text-primary"></div>

                <p className="text-muted mt-3">
                    Chargement des encadrants...
                </p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 bg-light min-vh-100">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">

                <div>
                    <h2 className="fw-bold mb-1">
                        Gestion des Encadrants
                    </h2>

                    <p className="text-muted mb-0">
                        Gérez les encadrants et leurs comptes.
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
                            : "Ajouter Encadrant"}
                    </button>

                </div>

            </div>

            <div className="row mb-4">

                <div className="col-lg-4 col-md-6 mb-3">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body d-flex justify-content-between align-items-center">

                            <div>
                                <p className="text-muted mb-1">
                                    Total Encadrants
                                </p>

                                <h3 className="fw-bold mb-0">
                                    {encadrants.length}
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
                                <i className="bi bi-people"></i>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="col-lg-4 col-md-6 mb-3">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body d-flex justify-content-between align-items-center">

                            <div>
                                <p className="text-muted mb-1">
                                    Services
                                </p>

                                <h3 className="fw-bold text-success mb-0">
                                    {
                                        new Set(
                                            encadrants.map((e) => e.service)
                                        ).size
                                    }
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
                                <i className="bi bi-building"></i>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="col-lg-4 col-md-6 mb-3">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                        <div className="card-body d-flex justify-content-between align-items-center">

                            <div>
                                <p className="text-muted mb-1">
                                    Spécialités
                                </p>

                                <h3 className="fw-bold text-warning mb-0">
                                    {
                                        new Set(
                                            encadrants.map(
                                                (e) => e.specialite
                                            )
                                        ).size
                                    }
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
                                <i className="bi bi-award"></i>
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
                            Ajouter Encadrant
                        </h5>
                    </div>

                    <div className="card-body p-4">

                        <form onSubmit={handleSubmit}>

                            <div className="row">

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        Nom
                                    </label>

                                    <input
                                        className="form-control"
                                        name="nom"
                                        value={form.nom}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        Prénom
                                    </label>

                                    <input
                                        className="form-control"
                                        name="prenom"
                                        value={form.prenom}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        Matricule
                                    </label>

                                    <input
                                        className="form-control"
                                        name="matricule"
                                        value={form.matricule}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        Téléphone
                                    </label>

                                    <input
                                        className="form-control"
                                        name="telephone"
                                        value={form.telephone}
                                        onChange={handleChange}
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
                                        Spécialité
                                    </label>

                                    <input
                                        className="form-control"
                                        name="specialite"
                                        value={form.specialite}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                            </div>

                            <hr className="my-4" />

                            <h5 className="fw-bold mb-3">
                                Compte de connexion
                            </h5>

                            <div className="row">

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        Username
                                    </label>

                                    <input
                                        className="form-control"
                                        name="username"
                                        value={form.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label className="form-label">
                                        Mot de passe
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        name="motDePasse"
                                        value={form.motDePasse}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                            </div>

                            <div className="d-flex justify-content-end mt-3">

                                <button
                                    type="submit"
                                    className="btn btn-primary px-4"
                                    disabled={loadingAction === "create"}
                                >

                                    {loadingAction === "create" ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Création...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-circle me-1"></i>
                                            Ajouter
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
                            Liste des encadrants
                        </h5>

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

                    </div>

                </div>

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table align-middle">

                            <thead className="table-light">

                            <tr>
                                <th>ID</th>
                                <th>Matricule</th>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Service</th>
                                <th>Spécialité</th>
                                <th className="text-end">
                                    Action
                                </th>
                            </tr>

                            </thead>

                            <tbody>

                            {currentEncadrants.length === 0 ? (

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

                                        Aucun encadrant trouvé
                                    </td>
                                </tr>

                            ) : (

                                currentEncadrants.map((e) => (

                                    <tr key={e.id}>

                                        <td>
                        <span className="fw-semibold">
                          #{e.id}
                        </span>
                                        </td>

                                        <td>{e.matricule}</td>

                                        <td>
                                            <div className="fw-semibold">
                                                {e.nom} {e.prenom}
                                            </div>
                                        </td>

                                        <td>{e.email}</td>

                                        <td>
                        <span className="badge bg-primary">
                          {e.service}
                        </span>
                                        </td>

                                        <td>{e.specialite}</td>

                                        <td>

                                            <div className="d-flex justify-content-end">

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        handleDelete(e.id)
                                                    }
                                                    disabled={
                                                        loadingAction ===
                                                        `delete-${e.id}`
                                                    }
                                                >

                                                    {loadingAction ===
                                                    `delete-${e.id}` ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-1"></span>
                                                            ...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="bi bi-trash me-1"></i>
                                                            Supprimer
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
                        totalItems={filteredEncadrants.length}
                        setCurrentPage={setCurrentPage}
                        setPageSize={setPageSize}
                    />

                </div>

            </div>

        </div>
    );
}