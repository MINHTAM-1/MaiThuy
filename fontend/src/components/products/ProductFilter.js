const ProductFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  return (
    <div className="top mb-8">
      <ul className="flex flex-wrap gap-4 justify-center">
        {categories.map((category) => (
          <li key={category.id}>
            <button
              onClick={() => onCategoryChange(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-colors duration-200 ${
                selectedCategory === category.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductFilter;