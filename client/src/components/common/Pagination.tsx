import { useMemo } from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const generatePages = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
      <button
        onClick={() => {
          onPageChange(currentPage - 1);
          scrollTo({ top: 0, behavior: 'smooth' });
        }}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ←
      </button>

      {generatePages.map((page, idx) => (
        <button
          key={idx}
          onClick={() => {
            if (typeof page === 'number') {
              onPageChange(page);
              scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          disabled={page === '...'}
          className={`w-9 h-9 flex items-center justify-center rounded-full border text-sm ${
            page === currentPage
              ? 'bg-black text-white border-black'
              : 'border-gray-300 text-gray-700 hover:bg-gray-100'
          } ${page === '...' ? 'cursor-default' : ''}`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => {
          onPageChange(currentPage + 1);
          scrollTo({ top: 0, behavior: 'smooth' });
        }}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        →
      </button>
    </div>
  );
};

export default Pagination;
