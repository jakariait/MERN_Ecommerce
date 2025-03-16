import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import useCategoryStore from "../../store/useCategoryStore.js";
import useSubCategoryStore from "../../store/useSubCategoryStore.js";
import useChildCategoryStore from "../../store/useChildCategoryStore.js";

const MobileMenu = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedSubCategory, setExpandedSubCategory] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const { categories, fetchCategories } = useCategoryStore();
  const { subCategories, fetchSubCategories } = useSubCategoryStore();
  const { childCategories, fetchChildCategories } = useChildCategoryStore();

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    fetchChildCategories();
  }, []);

  const toggleCategory = (categoryId) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
    setExpandedSubCategory(null);
  };

  const toggleSubCategory = (subId) => {
    setExpandedSubCategory((prev) => (prev === subId ? null : subId));
  };

  return (
    <div className="lg:hidden">
      <div className="">
        <nav className="p-1">
          <ul className="space-y-2">
            <li>
              <Link to="/" className="block p-3 font-semibold">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="block p-3 font-semibold">
                Shop
              </Link>
            </li>

            {/* Categories */}
            {categories?.map((category) => {
              const hasSubs = subCategories?.some(
                (sub) => sub?.category?._id === category._id,
              );

              return (
                <li key={category._id}>
                  <div className="flex justify-between items-center p-3">
                    <Link
                      to={`/shop/${category.name}`}
                      className="font-semibold"
                    >
                      {category.name}
                    </Link>
                    {hasSubs && (
                      <button
                        onClick={() => toggleCategory(category._id)}
                        className="text-xl"
                        aria-label={`Toggle ${category.name} subcategories`}
                      >
                        {expandedCategory === category._id ? (
                          <FiChevronUp />
                        ) : (
                          <FiChevronDown />
                        )}
                      </button>
                    )}
                  </div>

                  {expandedCategory === category._id && (
                    <MobileSubMenu
                      categoryId={category._id}
                      subCategories={subCategories}
                      childCategories={childCategories}
                      expandedSubCategory={expandedSubCategory}
                      toggleSubCategory={toggleSubCategory}
                    />
                  )}
                </li>
              );
            })}

            {/* More Links */}
            <li className={"p-2 font-semibold"}>About</li>
            <li className={"p-2 font-semibold"}>Blog</li>
            <li className={"p-2 font-semibold"}>
              <Link to="/contact-us">Contact</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

const MobileSubMenu = ({
  categoryId,
  subCategories,
  childCategories,
  expandedSubCategory,
  toggleSubCategory,
}) => {
  const filteredSubs = subCategories?.filter(
    (sub) => sub?.category?._id === categoryId,
  );

  return (
    <ul className="pl-6">
      {filteredSubs?.map((sub) => {
        const hasChildren = childCategories?.some(
          (child) => String(child?.subCategory?._id) === String(sub._id),
        );

        return (
          <li key={sub._id} className="py-2">
            <div className="flex justify-between items-center">
              <Link to={`/shop/${sub._id}`} className="block flex-1">
                {sub.name}
              </Link>

              {hasChildren && (
                <button
                  onClick={() => toggleSubCategory(sub._id)}
                  className="pl-2 text-gray-500"
                  aria-label={`Toggle ${sub.name} children`}
                >
                  {expandedSubCategory === sub._id ? (
                    <FiChevronUp />
                  ) : (
                    <FiChevronDown />
                  )}
                </button>
              )}
            </div>

            {expandedSubCategory === sub._id && hasChildren && (
              <ul className="pl-4">
                {childCategories
                  ?.filter(
                    (child) =>
                      String(child?.subCategory?._id) === String(sub._id),
                  )
                  ?.map((child) => (
                    <li key={child._id} className="py-1">
                      <Link
                        to={`/shop/${child.name}`}
                        className="block text-sm text-gray-600"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default MobileMenu;
