import React, { useCallback } from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems?: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  const totalPages = Math.ceil(totalItems! / itemsPerPage);

  const getVisiblePages = () => {
    const maxVisiblePages = 5; // Adjust this number based on your preference
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const startPage = Math.max(1, currentPage - halfVisiblePages);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    const visiblePages = [];

    if (startPage > 2) {
      visiblePages.push('ellipsis');
    }

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }

    if (endPage < totalPages - 1) {
      visiblePages.push('ellipsis');
    }

    return visiblePages;
  };

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    },
    [onPageChange, totalPages]
  );

  return (
    <nav aria-label="Page navigation example">
      <ul className="list-style-none flex flex-wrap items-center justify-center">
        {/* {currentPage > 1 && (
          <li className="mr-[10px]">
            <span
              className={`relative flex hidden h-[36px] w-[36px] cursor-pointer items-center justify-center gap-[10px] rounded-[6px] border-[2px] border-teal bg-transparent text-[13px] font-bold text-teal transition-all duration-300 ${
                currentPage === 1 ? 'hidden' : ''
              } dark:text-neutral-400`}
              onClick={() => handlePageChange(1)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#57B6B2"
                width="24px"
                height="24px"
              >
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            </span>
          </li>
        )} */}
        <li>
          <span
            className={`border-teal text-teal relative flex h-[36px] w-[90px] cursor-pointer items-center justify-center gap-[10px] rounded-[6px] border-[2px] bg-transparent text-[13px] font-bold transition-all duration-300 md:w-[90px] ${
              currentPage === 1 ? 'hidden' : ''
            } dark:text-neutral-400`}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <svg
              className="rotate-180"
              xmlns="http://www.w3.org/2000/svg"
              width="4"
              height="7"
              viewBox="0 0 4 7"
              fill="none"
            >
              <path d="M4 3.5L0.25 6.53109L0.25 0.468911L4 3.5Z" fill="#35AAAF" />
            </svg>
            <span>Previous</span>
          </span>
        </li>
        {getVisiblePages().map((page, index) => (
          <li key={index}>
            {page === 'ellipsis' ? (
              <span className="relative block hidden h-[36px] w-[26px] text-center text-[14px] leading-[36px] text-[#b2b2b2] md:w-[36px]">
                ...
              </span>
            ) : (
              <span
                className={`relative block h-[36px] w-[36px] bg-transparent text-center text-[14px] font-semibold leading-[36px] text-[#b2b2b2] transition-all duration-300 md:w-[36px] ${
                  currentPage === page
                    ? 'bg-primary-100 text-teal'
                    : 'hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white'
                }`}
                onClick={() => handlePageChange(parseInt(`${page}`))}
              >
                {page}
                {currentPage === page && (
                  <span className="border-teal absolute left-0 top-0 h-[36px] w-[36px] rounded-[6px] border-[2px] text-[0] md:w-[36px]">
                    (current)
                  </span>
                )}
              </span>
            )}
          </li>
        ))}
        <li>
          <span
            className={`border-teal text-teal relative flex h-[36px] w-[90px] cursor-pointer items-center justify-center gap-[10px] rounded-[6px] border-[2px] bg-transparent text-[13px] font-bold transition-all duration-300 md:w-[90px] ${
              currentPage === totalPages ? 'hidden' : ''
            } dark:text-neutral-400`}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <span>Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="4"
              height="7"
              viewBox="0 0 4 7"
              fill="none"
            >
              <path d="M4 3.5L0.25 6.53109L0.25 0.468911L4 3.5Z" fill="#35AAAF" />
            </svg>
          </span>
        </li>
        {/* {currentPage !== totalPages && (
          <li className="ml-[10px]">
            <span
              className={`relative flex hidden h-[36px] w-[36px] cursor-pointer items-center justify-center gap-[10px] rounded-[6px] border-[2px] border-teal bg-transparent text-[13px] font-bold text-teal transition-all duration-300 ${
                currentPage === totalPages ? 'hidden' : ''
              } dark:text-neutral-400`}
              onClick={() => handlePageChange(totalPages)}
            >
              <svg
                className="rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#57B6B2"
                width="24px"
                height="24px"
              >
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                <path d="M0 0h24v24H0z" fill="none" />
              </svg>
            </span>
          </li>
        )} */}
      </ul>
    </nav>
  );
};

export default Pagination;
