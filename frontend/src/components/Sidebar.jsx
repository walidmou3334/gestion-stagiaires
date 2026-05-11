import { NavLink } from "react-router-dom";

export default function Sidebar() {
    const role = localStorage.getItem("role");

    const menuByRole = {
        CANDIDAT: [
            {
                label: "Déposer candidature",
                path: "/candidature",
                icon: "bi bi-send",
            },
            {
                label: "Mes candidatures",
                path: "/mes-candidatures",
                icon: "bi bi-file-earmark-text",
            },
            {
                label: "Mes entretiens",
                path: "/mes-entretiens",
                icon: "bi bi-calendar-event",
            },
            {
                label: "Mon stage",
                path: "/mes-stages",
                icon: "bi bi-mortarboard",
            },
            {
                label: "Déposer livrable",
                path: "/deposer-livrable",
                icon: "bi bi-upload",
            },
            {
                label: "Mes livrables",
                path: "/mes-livrables",
                icon: "bi bi-folder2-open",
            },
            {
                label: "Mes évaluations",
                path: "/mes-evaluations",
                icon: "bi bi-clipboard-check",
            },
        ],

        ENCADRANT: [
            {
                label: "Livrables stagiaires",
                path: "/encadrant/livrables",
                icon: "bi bi-folder-check",
            },
            {
                label: "Évaluations",
                path: "/encadrant/evaluations",
                icon: "bi bi-star",
            },
        ],

        RH: [
            {
                label: "Candidatures RH",
                path: "/rh/candidatures",
                icon: "bi bi-file-earmark-text",
            },
            {
                label: "Entretiens RH",
                path: "/rh/entretiens",
                icon: "bi bi-calendar-event",
            },
            {
                label: "Encadrants",
                path: "/rh/encadrants",
                icon: "bi bi-people",
            },
            {
                label: "Affectations",
                path: "/rh/stages",
                icon: "bi bi-diagram-3",
            },
            {
                label: "Livrables RH",
                path: "/rh/livrables",
                icon: "bi bi-folder2-open",
            },
            {
                label: "Évaluations RH",
                path: "/rh/evaluations",
                icon: "bi bi-clipboard-check",
            },
        ],

        ADMIN: [
            {
                label: "Candidatures RH",
                path: "/rh/candidatures",
                icon: "bi bi-file-earmark-text",
            },
            {
                label: "Entretiens RH",
                path: "/rh/entretiens",
                icon: "bi bi-calendar-event",
            },
            {
                label: "Encadrants",
                path: "/rh/encadrants",
                icon: "bi bi-people",
            },
            {
                label: "Affectations",
                path: "/rh/stages",
                icon: "bi bi-diagram-3",
            },
            {
                label: "Livrables RH",
                path: "/rh/livrables",
                icon: "bi bi-folder2-open",
            },
            {
                label: "Évaluations RH",
                path: "/rh/evaluations",
                icon: "bi bi-clipboard-check",
            },
        ],
    };

    const commonMenu = [
        {
            label: "Dashboard",
            path: "/",
            icon: "bi bi-speedometer2",
        },
        {
            label: "Mon profil",
            path: "/profile",
            icon: "bi bi-person-circle",
        },
    ];

    const roleMenu = menuByRole[role] || [];

    const getLinkClass = ({ isActive }) =>
        `nav-link d-flex align-items-center gap-2 rounded-3 px-3 py-2 mb-1 ${
            isActive
                ? "bg-primary text-white shadow-sm"
                : "text-white-50 sidebar-link"
        }`;

    return (
        <aside
            className="text-white d-flex flex-column"
            style={{
                width: "270px",
                minHeight: "100vh",
                background:
                    "linear-gradient(180deg, #0b1727 0%, #111827 55%, #0f172a 100%)",
                position: "sticky",
                top: 0,
            }}
        >
            <div className="p-4 border-bottom border-secondary border-opacity-25">
                <div className="d-flex align-items-center gap-3">
                    <div
                        className="rounded-3 bg-primary d-flex align-items-center justify-content-center"
                        style={{
                            width: "44px",
                            height: "44px",
                            fontSize: "22px",
                        }}
                    >
                        <i className="bi bi-mortarboard"></i>
                    </div>

                    <div>
                        <h5 className="fw-bold mb-0">Gestion Stages</h5>
                        <small className="text-white-50">Plateforme RH</small>
                    </div>
                </div>
            </div>

            <div className="px-3 py-4 flex-grow-1">
                <small className="text-uppercase text-white-50 px-3 d-block mb-2">
                    Général
                </small>

                <ul className="nav flex-column mb-4">
                    {commonMenu.map((item) => (
                        <li className="nav-item" key={item.path}>
                            <NavLink to={item.path} className={getLinkClass}>
                                <i className={item.icon}></i>
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <small className="text-uppercase text-white-50 px-3 d-block mb-2">
                    {role || "Utilisateur"}
                </small>

                <ul className="nav flex-column">
                    {roleMenu.map((item) => (
                        <li className="nav-item" key={item.path}>
                            <NavLink to={item.path} className={getLinkClass}>
                                <i className={item.icon}></i>
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="p-3 border-top border-secondary border-opacity-25">
                <div className="bg-white bg-opacity-10 rounded-4 p-3">
                    <small className="text-white-50 d-block">Connecté comme</small>
                    <span className="fw-semibold">{role || "Utilisateur"}</span>
                </div>
            </div>
        </aside>
    );
}