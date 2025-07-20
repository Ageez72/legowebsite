'use client'

import Cookies from 'js-cookie';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Pagination({ currentPage, pagesToken, totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();


  const goToPage = (page, token = null) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());

    if (token) {
      Cookies.set('pagesToken', token); // ✅ store in cookie
    } else {
      Cookies.remove('pagesToken'); // ✅ clear if not needed
    }

    router.push(`?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const renderPageButtons = () => {
  const buttons = [];
  const maxVisible = 3; // number of pages to show around currentPage

  // Always show page 1
  buttons.push(
    <button
      key={1}
      onClick={() => goToPage(1, pagesToken)}
      aria-current={1 === currentPage ? 'page' : undefined}
      className={`relative z-10 inline-flex items-center px-4 py-2 focus:z-20 ${currentPage === 1 ? 'active' : ''}`}
    >
      1
    </button>
  );

  // Show start dots if needed
  if (currentPage > 3) {
    buttons.push(
      <span key="startDots" className="relative z-10 inline-flex items-center px-4 py-2 dots pointer-events-none">
        ...
      </span>
    );
  }

  // Pages around current (excluding 1 and totalPages)
  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);

  for (let i = startPage; i <= endPage; i++) {
    // Skip page 1 and last page to avoid duplicates
    if (i !== 1 && i !== totalPages) {
      buttons.push(
        <button
          key={i}
          onClick={() => goToPage(i, pagesToken)}
          aria-current={i === currentPage ? 'page' : undefined}
          className={`relative z-10 inline-flex items-center px-4 py-2 focus:z-20 ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }
  }

  // Show end dots if needed
  if (currentPage < totalPages - 2) {
    buttons.push(
      <span key="endDots" className="relative z-10 inline-flex items-center px-4 py-2 dots pointer-events-none">
        ...
      </span>
    );
  }

  // Always show last page if more than 1
  if (totalPages > 1) {
    buttons.push(
      <button
        key={totalPages}
        onClick={() => goToPage(totalPages, pagesToken)}
        aria-current={totalPages === currentPage ? 'page' : undefined}
        className={`relative z-10 inline-flex items-center px-4 py-2 focus:z-20 ${totalPages === currentPage ? 'active' : ''}`}
      >
        {totalPages}
      </button>
    );
  }

  return buttons;
};


  return (
    <div className="flex items-center justify-center mt-4 px-4 py-3 sm:px-6 pagination-container">
      <div className="flex sm:flex-1 sm:items-center sm:justify-center">
        <div>
          <nav aria-label="Pagination" className="isolate inline-flex -space-x-px rounded-md gap-3">
            <button
              onClick={() => goToPage(currentPage - 1, pagesToken)}
              className="relative z-10 inline-flex items-center px-4 py-2 focus:z-20 prev"
              disabled={currentPage <= 1}
            >
              <span className="sr-only">Previous</span>
              <i className="icon-arrow-right-01-round"></i>
            </button>

            {renderPageButtons()}

            <button
              onClick={() => goToPage(currentPage + 1, pagesToken)}
              className="relative z-10 inline-flex items-center px-4 py-2 focus:z-20 next"
              disabled={currentPage >= totalPages}
            >
              <span className="sr-only">Next</span>
              <i className="icon-arrow-left-01-round"></i>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
