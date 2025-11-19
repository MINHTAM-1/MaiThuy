const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 mt-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Trang <span className="font-medium">{page + 1}</span> của{' '}
          <span className="font-medium">{totalPages}</span>
        </div>
        <div className="flex space-x-2">
          <button
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium 
              text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Trước
          </button>
          <button
            disabled={page + 1 >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium 
              text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
