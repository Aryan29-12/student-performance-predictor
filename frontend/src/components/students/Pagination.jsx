import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export default function Pagination({ currentPage, totalCount, pageSize, onPageChange, onPageSizeChange }) {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const from = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="pagination">
      <div className="pagination__info">
        {totalCount === 0 ? 'No records' : `Showing ${from}–${to} of ${totalCount}`}
      </div>

      <div className="pagination__controls">
        <label className="pagination__size-label">
          Rows:
          <select
            className="pagination__size-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>

        <button
          className="btn btn--icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        <span className="pagination__page-indicator">
          {currentPage} / {totalPages}
        </span>

        <button
          className="btn btn--icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

