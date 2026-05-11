import React from "react";

export default function Pagination({
                                       currentPage,
                                       totalPages,
                                       pageSize,
                                       totalItems,
                                       setCurrentPage,
                                       setPageSize,
                                   }) {

    const startItem =
        totalItems === 0
            ? 0
            : (currentPage - 1) * pageSize + 1;

    const endItem = Math.min(
        currentPage * pageSize,
        totalItems
    );

    return (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 gap-3">

            <div className="d-flex align-items-center gap-2">

        <span className="text-muted small">
          Afficher
        </span>

                <select
                    className="form-select form-select-sm"
                    style={{
                        width: "85px",
                    }}
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>

                <span className="text-muted small">
          éléments
        </span>

            </div>

            <div className="text-muted small">

                {startItem} - {endItem} sur {totalItems}

            </div>

            <div className="btn-group">

                <button
                    className="btn btn-outline-primary btn-sm"
                    disabled={currentPage === 1 || totalPages === 0}
                    onClick={() => setCurrentPage(1)}
                >
                    <i className="bi bi-chevron-double-left"></i>
                </button>

                <button
                    className="btn btn-outline-primary btn-sm"
                    disabled={currentPage === 1 || totalPages === 0}
                    onClick={() => setCurrentPage(currentPage - 1)}
                >
                    <i className="bi bi-chevron-left"></i>
                </button>

                <button
                    className="btn btn-primary btn-sm"
                    disabled
                >
                    {totalPages === 0
                        ? 0
                        : currentPage} / {totalPages}
                </button>

                <button
                    className="btn btn-outline-primary btn-sm"
                    disabled={
                        currentPage === totalPages ||
                        totalPages === 0
                    }
                    onClick={() => setCurrentPage(currentPage + 1)}
                >
                    <i className="bi bi-chevron-right"></i>
                </button>

                <button
                    className="btn btn-outline-primary btn-sm"
                    disabled={
                        currentPage === totalPages ||
                        totalPages === 0
                    }
                    onClick={() => setCurrentPage(totalPages)}
                >
                    <i className="bi bi-chevron-double-right"></i>
                </button>

            </div>

        </div>
    );
}