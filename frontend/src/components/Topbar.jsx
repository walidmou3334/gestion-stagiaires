import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

export default function Topbar() {
    const navigate = useNavigate();

    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    const currentDate = useMemo(() => {
        return new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    }, []);

    const logout = () => {
        const confirmLogout = window.confirm(
            "Voulez-vous vraiment vous déconnecter ?"
        );

        if (!confirmLogout) {
            return;
        }

        localStorage.clear();
        navigate("/login");
    };

    const getRoleBadgeClass = () => {
        if (role === "ADMIN") {
            return "bg-danger";
        }

        if (role === "RH") {
            return "bg-primary";
        }

        if (role === "ENCADRANT") {
            return "bg-info";
        }

        if (role === "CANDIDAT") {
            return "bg-success";
        }

        return "bg-secondary";
    };

    return (
        <nav
            className="navbar navbar-expand-lg bg-white shadow-sm px-4 py-3 border-bottom"
            style={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
            }}
        >
            <div className="container-fluid p-0">

                <div className="d-flex flex-column">
                    <h4 className="fw-bold mb-0 text-dark">
                        Tableau de bord
                    </h4>

                    <small className="text-muted text-capitalize">
                        {currentDate}
                    </small>
                </div>

                <div className="d-flex align-items-center gap-3">

                    <div className="d-none d-md-flex align-items-center gap-3">

                        <button
                            className="btn btn-light position-relative rounded-circle shadow-sm"
                            style={{
                                width: "44px",
                                height: "44px",
                            }}
                        >
                            <i className="bi bi-bell fs-5"></i>

                            <span
                                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                style={{
                                    fontSize: "10px",
                                }}
                            >
                3
              </span>
                        </button>

                        <button
                            className="btn btn-light rounded-circle shadow-sm"
                            style={{
                                width: "44px",
                                height: "44px",
                            }}
                        >
                            <i className="bi bi-envelope fs-5"></i>
                        </button>

                    </div>

                    <div className="d-flex align-items-center gap-3 px-3 py-2 rounded-4 bg-light border">

                        <div
                            className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center fw-bold"
                            style={{
                                width: "46px",
                                height: "46px",
                                fontSize: "18px",
                            }}
                        >
                            {username
                                ? username.charAt(0).toUpperCase()
                                : "U"}
                        </div>

                        <div className="d-none d-md-block">
                            <div className="fw-semibold text-dark">
                                {username || "Utilisateur"}
                            </div>

                            <span className={`badge ${getRoleBadgeClass()}`}>
                {role || "USER"}
              </span>
                        </div>

                    </div>

                    <button
                        className="btn btn-danger d-flex align-items-center gap-2 px-3"
                        onClick={logout}
                    >
                        <i className="bi bi-box-arrow-right"></i>

                        <span className="d-none d-md-inline">
              Logout
            </span>
                    </button>

                </div>

            </div>
        </nav>
    );
}