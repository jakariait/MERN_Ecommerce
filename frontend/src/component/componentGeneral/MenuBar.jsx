import { useState, memo } from "react";
import { Link } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa6";
import useCategoryStore from "../../store/useCategoryStore.js";
import useSubCategoryStore from "../../store/useSubCategoryStore.js";
import useChildCategoryStore from "../../store/useChildCategoryStore.js";

const MenuBar = () => {
  const { categories } = useCategoryStore();
  const { subCategories } = useSubCategoryStore();
  const { childCategories } = useChildCategoryStore();

  // Function to build the query string
  const buildQueryString = (categoryName) => {
    const params = new URLSearchParams({
      category: categoryName, // Dynamically pass the category
    });
    return params.toString();
  };

  return (
    <div className="lg:shadow lg:bg-white ">
      <nav className="p-3 xl:container xl:mx-auto">
        <ul className="lg:flex space-x-3">
          <MenuItem label={<Link to="/">Home</Link>} />
          <MenuItem label={<Link to="/shop">Shop</Link>} />

          {/* Categories & Subcategories */}
          {categories?.length ? (
            categories
              .filter((category) => category.showOnNavbar)
              .map((category) => (
                <MenuItem
                  key={category._id}
                  label={
                    <Link to={`/shop?${buildQueryString(category.name)}`}>
                      <span
                        className={
                          "grid grid-cols-2 gap-1 items-center justify-center"
                        }
                      >
                        {category.name}
                        {Array.isArray(subCategories) &&
                          subCategories.some(
                            (subCat) =>
                              subCat?.category?._id === category._id &&
                              subCat.isActive,
                          ) && <FaAngleDown />}
                      </span>
                    </Link>
                  }
                >
                  {Array.isArray(subCategories) &&
                    subCategories.some(
                      (subCat) =>
                        subCat?.category?._id === category._id &&
                        subCat.isActive,
                    ) && (
                      <SubMenu
                        subCategories={subCategories}
                        categoryId={category._id}
                        childCategories={childCategories}
                      />
                    )}
                </MenuItem>
              ))
          ) : (
            <MenuItem label={<span></span>} />
          )}

          {/* More Dropdown */}
          <MenuItem
            label={
              <div className="flex items-center gap-1 cursor-pointer">
                More <FaAngleDown />
              </div>
            }
          >
            <SubMenu
              items={[
                { name: "About Us", path: "/about" },
                { name: "FAQ", path: "/faqs" },
                { name: "Privacy Policy", path: "/privacypolicy" },
                { name: "Refund Policy", path: "/refundpolicy" },
                { name: "Terms of Services", path: "/termofservice" },
                { name: "Blog", path: "/blog" },
                { name: "Contact", path: "/contact-us" },
              ]}
            />
          </MenuItem>
        </ul>
      </nav>
    </div>
  );
};

// ✅ Optimized MenuItem Component
const MenuItem = memo(({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  let timer;

  const handleMouseEnter = () => {
    clearTimeout(timer);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timer = setTimeout(() => setIsOpen(false), 300);
  };

  return (
    <li
      className="relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="px-4 py-2 text-gray-800 font-semibold">{label}</button>

      {/* Submenu */}
      {isOpen && (
        <div
          className="absolute left-0 mt-2 bg-white shadow-lg rounded-md w-56 z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </div>
      )}
    </li>
  );
});

// ✅ Optimized SubMenu Component
const SubMenu = memo(
  ({ subCategories, categoryId, childCategories, items }) => {
    const filteredSubCategories = Array.isArray(subCategories)
      ? subCategories.filter(
          (subCategory) => subCategory?.category?._id === categoryId,
        )
      : [];

    return (
      <ul className="text-black p-2">
        {filteredSubCategories
          .filter((subCategory) => subCategory.isActive)
          .map((subCategory) => (
            <li key={subCategory._id} className="px-4 py-2">
              <Link
                to={`/shop?${new URLSearchParams({
                  subcategory: subCategory.slug, // Dynamically pass the subcategory
                }).toString()}`}
                className="block w-full h-full"
              >
                {subCategory.name}
              </Link>
              <ChildSubMenu
                subCategoryId={subCategory._id}
                childCategories={childCategories}
              />
            </li>
          ))}

        {items?.map((item, index) => (
          <li key={index} className="px-4 py-2">
            <Link to={item.path} className="block w-full h-full">
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    );
  },
);

// ✅ Optimized ChildSubMenu Component
const ChildSubMenu = memo(({ childCategories, subCategoryId }) => {
  const filteredChildCategories = Array.isArray(childCategories)
    ? childCategories.filter(
        (childCategory) =>
          String(
            childCategory?.subCategory?._id || childCategory?.subCategory,
          ) === String(subCategoryId),
      )
    : [];

  return (
    <ul className="ml-4">
      {filteredChildCategories
        .filter((childCategory) => childCategory.isActive)
        .map((childCategory) => (
          <li key={childCategory._id} className="px-4 py-2">
            <Link
              to={`/shop?${new URLSearchParams({
                childCategory: childCategory.slug, // Dynamically pass the child category
              }).toString()}`}
            >
              {childCategory.name}
            </Link>
          </li>
        ))}
    </ul>
  );
});

export default MenuBar;
