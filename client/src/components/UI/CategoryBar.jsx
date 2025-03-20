export default function CategoryBar({
  categoryData,
  onSelect,
  activeCategory,
}) {
  return (
    <nav className="category-slider">
      {categoryData.map((category) => {
        const categoryName = category.type_name;
        const categoryId = category.id;
        const isActive = activeCategory === categoryId;
        let className = "category-button";

        if (isActive) {
          className += " active";
        }
        return (
          <button
            className={className}
            key={categoryId}
            disabled={isActive}
            onClick={() => onSelect(categoryId)}
          >
            {categoryName}
          </button>
        );
      })}
    </nav>
  );
}
