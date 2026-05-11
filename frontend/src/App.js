import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

import CandidaturePage from "./pages/CandidaturePage";
import MesCandidaturesPage from "./pages/MesCandidaturesPage";
import RhCandidaturesPage from "./pages/RhCandidaturesPage";

import RhEntretiensPage from "./pages/RhEntretiensPage";
import MesEntretiensPage from "./pages/MesEntretiensPage";

import RhEncadrantsPage from "./pages/RhEncadrantsPage";
import RhStagesPage from "./pages/RhStagesPage";
import MesStagesPage from "./pages/MesStagesPage";

import DeposerLivrablePage from "./pages/DeposerLivrablePage";
import MesLivrablesPage from "./pages/MesLivrablesPage";
import RhLivrablesPage from "./pages/RhLivrablesPage";
import EncadrantLivrablesPage from "./pages/EncadrantLivrablesPage";

import EncadrantEvaluationsPage from "./pages/EncadrantEvaluationsPage";
import MesEvaluationsPage from "./pages/MesEvaluationsPage";
import RhEvaluationsPage from "./pages/RhEvaluationsPage";

import DashboardPage from "./pages/DashboardPage";

function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" replace />;
}

function ProtectedLayout({ children }) {
    return (
        <PrivateRoute>
            <MainLayout>
                {children}
            </MainLayout>
        </PrivateRoute>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* PUBLIC */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* DASHBOARD */}
                <Route
                    path="/"
                    element={
                        <ProtectedLayout>
                            <DashboardPage />
                        </ProtectedLayout>
                    }
                />

                {/* PROFILE */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedLayout>
                            <ProfilePage />
                        </ProtectedLayout>
                    }
                />

                {/* CANDIDAT */}
                <Route
                    path="/candidature"
                    element={
                        <ProtectedLayout>
                            <CandidaturePage />
                        </ProtectedLayout>
                    }
                />

                <Route
                    path="/mes-candidatures"
                    element={
                        <ProtectedLayout>
                            <MesCandidaturesPage />
                        </ProtectedLayout>
                    }
                />

                <Route
                    path="/mes-entretiens"
                    element={
                        <ProtectedLayout>
                            <MesEntretiensPage />
                        </ProtectedLayout>
                    }
                />

                <Route
                    path="/mes-stages"
                    element={
                        <ProtectedLayout>
                            <MesStagesPage />
                        </ProtectedLayout>
                    }
                />

                <Route
                    path="/deposer-livrable"
                    element={
                        <ProtectedLayout>
                            <DeposerLivrablePage />
                        </ProtectedLayout>
                    }
                />

                <Route
                    path="/mes-livrables"
                    element={
                        <ProtectedLayout>
                            <MesLivrablesPage />
                        </ProtectedLayout>
                    }
                />

                <Route
                    path="/mes-evaluations"
                    element={
                        <ProtectedLayout>
                            <MesEvaluationsPage />
                        </ProtectedLayout>
                    }
                />

                {/* RH / ADMIN */}
                <Route
                    path="/rh/candidatures"
                    element={
                        <ProtectedLayout>
                            <RhCandidaturesPage />
                        </ProtectedLayout>
                    }
                />

                <Route
                    path="/rh/entretiens"
                    element={
                        <ProtectedLayout>
                            <RhEntretiensPage />
                        </ProtectedLayout>
                    }
                />

                <Route
                    path="/rh/encadrants"
                    element={
                        <ProtectedLayout>
                            <RhEncadrantsPage />
                        </ProtectedLayout>
                    }
                />

                <Route
                    path="/rh/stages"
                    element={
                        <ProtectedLayout>
                            <RhStagesPage />
                        </ProtectedLayout>
                    }
                />

                <Route
                    path="/rh/livrables"
                    element={
                        <ProtectedLayout>
                            <RhLivrablesPage />
                        </ProtectedLayout>
                    }
                />

                <Route
                    path="/rh/evaluations"
                    element={
                        <ProtectedLayout>
                            <RhEvaluationsPage />
                        </ProtectedLayout>
                    }
                />

                {/* ENCADRANT */}
                <Route
                    path="/encadrant/livrables"
                    element={
                        <ProtectedLayout>
                            <EncadrantLivrablesPage />
                        </ProtectedLayout>
                    }
                />

                <Route
                    path="/encadrant/evaluations"
                    element={
                        <ProtectedLayout>
                            <EncadrantEvaluationsPage />
                        </ProtectedLayout>
                    }
                />

                {/* NOT FOUND */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </BrowserRouter>
    );
}