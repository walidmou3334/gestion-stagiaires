import React, { useEffect, useState } from "react";
import {
    getRhDashboard,
    getCandidatDashboard,
    getEncadrantDashboard,
} from "../services/dashboardService";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from "chart.js";

import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
);

function StatCard({ title, value, color, icon }) {
    return (
        <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body d-flex justify-content-between align-items-center">

                    <div>
                        <p className="text-muted mb-1 small">
                            {title}
                        </p>

                        <h3 className="fw-bold mb-0">
                            {value || 0}
                        </h3>
                    </div>

                    <div
                        className={`rounded-circle bg-${color} bg-opacity-10 text-${color}
            d-flex justify-content-center align-items-center`}
                        style={{
                            width: "58px",
                            height: "58px",
                            fontSize: "24px",
                        }}
                    >
                        <i className={icon}></i>
                    </div>

                </div>
            </div>
        </div>
    );
}

function SectionCard({ title, children, action }) {
    return (
        <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-header bg-white border-0 py-3 px-4 d-flex justify-content-between align-items-center">

                <h5 className="fw-bold mb-0">
                    {title}
                </h5>

                {action}

            </div>

            <div className="card-body">
                {children}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const [stats, setStats] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                let res;

                if (role === "RH" || role === "ADMIN") {
                    res = await getRhDashboard();
                }

                if (role === "CANDIDAT") {
                    res = await getCandidatDashboard();
                }

                if (role === "ENCADRANT") {
                    res = await getEncadrantDashboard();
                }

                setStats(res.data);
            } catch (e) {
                console.error(e);
                setError("Erreur lors du chargement du dashboard");
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [role]);

    if (loading) {
        return (
            <div className="container-fluid p-5 text-center">
                <div className="spinner-border text-primary"></div>

                <p className="mt-3 text-muted">
                    Chargement du dashboard...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger border-0 shadow-sm rounded-4">
                    {error}
                </div>
            </div>
        );
    }

    const candidatureChart = {
        labels: ["Acceptées", "En attente", "Refusées"],
        datasets: [
            {
                data: [
                    stats.candidaturesAcceptees || 0,
                    stats.candidaturesEnAttente || 0,
                    stats.candidaturesRefusees || 0,
                ],
                backgroundColor: [
                    "#198754",
                    "#ffc107",
                    "#dc3545",
                ],
                borderWidth: 0,
            },
        ],
    };

    const stageChart = {
        labels: ["En cours", "Terminés", "Annulés"],
        datasets: [
            {
                label: "Stages",
                data: [
                    stats.stagesEnCours || 0,
                    stats.stagesTermines || 0,
                    stats.stagesAnnules || 0,
                ],
                backgroundColor: [
                    "#0d6efd",
                    "#198754",
                    "#dc3545",
                ],
                borderRadius: 8,
            },
        ],
    };

    return (
        <div className="container-fluid p-4 bg-light min-vh-100">

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">

                <div>
                    <h2 className="fw-bold mb-1">
                        Tableau de bord
                    </h2>

                    <p className="text-muted mb-0">
                        Bienvenue <strong>{username}</strong>
                    </p>
                </div>

                <div className="mt-3 mt-md-0">
          <span className="badge bg-primary px-3 py-2 rounded-pill">
            {role}
          </span>
                </div>

            </div>

            {(role === "RH" || role === "ADMIN") && (
                <>

                    <div className="row">

                        <StatCard
                            title="Candidatures"
                            value={stats.totalCandidatures}
                            color="primary"
                            icon="bi bi-file-earmark-text"
                        />

                        <StatCard
                            title="Entretiens"
                            value={stats.totalEntretiens}
                            color="warning"
                            icon="bi bi-calendar-event"
                        />

                        <StatCard
                            title="Stages"
                            value={stats.totalStages}
                            color="success"
                            icon="bi bi-mortarboard"
                        />

                        <StatCard
                            title="Livrables"
                            value={stats.totalLivrables}
                            color="info"
                            icon="bi bi-folder"
                        />

                    </div>

                    <div className="row">

                        <div className="col-lg-6 mb-4">

                            <SectionCard title="Statistiques des candidatures">

                                <div
                                    style={{
                                        height: "350px",
                                    }}
                                    className="d-flex justify-content-center align-items-center"
                                >
                                    <Doughnut
                                        data={candidatureChart}
                                        options={{
                                            maintainAspectRatio: false,
                                        }}
                                    />
                                </div>

                            </SectionCard>

                        </div>

                        <div className="col-lg-6 mb-4">

                            <SectionCard title="État des stages">

                                <div
                                    style={{
                                        height: "350px",
                                    }}
                                >
                                    <Bar
                                        data={stageChart}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: false,
                                                },
                                            },
                                        }}
                                    />
                                </div>

                            </SectionCard>

                        </div>

                    </div>

                    <div className="row">

                        <div className="col-lg-6 mb-4">

                            <SectionCard title="Notifications">

                                <div className="alert alert-warning border-0 rounded-4">
                                    <i className="bi bi-hourglass-split me-2"></i>

                                    {stats.candidaturesEnAttente || 0}
                                    {" "}candidature(s) en attente.
                                </div>

                                <div className="alert alert-info border-0 rounded-4">
                                    <i className="bi bi-folder2-open me-2"></i>

                                    {stats.livrablesEnAttente || 0}
                                    {" "}livrable(s) à vérifier.
                                </div>

                                <div className="alert alert-success border-0 rounded-4">
                                    <i className="bi bi-check-circle me-2"></i>

                                    {stats.stagesTermines || 0}
                                    {" "}stage(s) terminés.
                                </div>

                            </SectionCard>

                        </div>

                        <div className="col-lg-6 mb-4">

                            <SectionCard title="Actions rapides">

                                <div className="d-grid gap-3">

                                    <button className="btn btn-primary rounded-3 py-2">
                                        <i className="bi bi-file-earmark-plus me-2"></i>
                                        Voir les candidatures
                                    </button>

                                    <button className="btn btn-success rounded-3 py-2">
                                        <i className="bi bi-person-workspace me-2"></i>
                                        Gérer les stages
                                    </button>

                                    <button className="btn btn-warning rounded-3 py-2 text-white">
                                        <i className="bi bi-folder-check me-2"></i>
                                        Vérifier les livrables
                                    </button>

                                </div>

                            </SectionCard>

                        </div>

                    </div>

                </>
            )}

            {role === "CANDIDAT" && (

                <div className="row">

                    <StatCard
                        title="Mes candidatures"
                        value={stats.mesCandidatures}
                        color="primary"
                        icon="bi bi-file-earmark"
                    />

                    <StatCard
                        title="Mes entretiens"
                        value={stats.mesEntretiens}
                        color="warning"
                        icon="bi bi-calendar2"
                    />

                    <StatCard
                        title="Mon stage"
                        value={stats.mesStages}
                        color="success"
                        icon="bi bi-mortarboard-fill"
                    />

                    <StatCard
                        title="Mes livrables"
                        value={stats.mesLivrables}
                        color="secondary"
                        icon="bi bi-folder"
                    />

                </div>

            )}

            {role === "ENCADRANT" && (

                <div className="row">

                    <StatCard
                        title="Mes stages"
                        value={stats.mesStages}
                        color="primary"
                        icon="bi bi-mortarboard"
                    />

                    <StatCard
                        title="Livrables reçus"
                        value={stats.livrablesRecus}
                        color="info"
                        icon="bi bi-folder2-open"
                    />

                    <StatCard
                        title="En attente"
                        value={stats.livrablesEnAttente}
                        color="warning"
                        icon="bi bi-hourglass"
                    />

                    <StatCard
                        title="Évaluations"
                        value={stats.evaluationsRealisees}
                        color="dark"
                        icon="bi bi-clipboard-check"
                    />

                </div>

            )}

        </div>
    );
}