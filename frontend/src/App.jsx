import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GeneralInfoPage from "./pagesAdmin/GeneralInfoPage.jsx";
import HomePage from "./pagesUser/HomePage.jsx";
import SubscribedUsersPage from "./pagesAdmin/SubscribedUsersPage.jsx";
import SliderBannerPage from "./pagesAdmin/SliderBannerPage.jsx";
import useColorStore from "./store/ColorStore.js";
import { useEffect } from "react";
import ColorUpdaterPage from "./pagesAdmin/ColorUpdaterPage.jsx";
import SocialLinkUpdaterPage from "./pagesAdmin/SocialLinkUpdaterPage.jsx";
import ContactUsPage from "./pagesUser/ContactUsPage.jsx";
import GeneralInfoStore from "./store/GeneralInfoStore.js";
import CarouselStore from "./store/CarouselStore.js";
import FeatureStore from "./store/FeatureStore.js";
import CategoryStore from "./store/useCategoryStore.js";
import SubCategoryStore from "./store/useSubCategoryStore.js";
import useSocialMediaLinkStore from "./store/SocialMediaLinkStore.js";
import useProductSizeStore from "./store/useProductSizeStore.js";
import useFlagStore from "./store/useFlagStore.js";
import useChildCategoryStore from "./store/useChildCategoryStore.js";
import useProductStore from "./store/useProductStore.js";
import useAuthUserStore from "./store/AuthUserStore.js";
import ContactRequestPage from "./pagesAdmin/ContactRequestPage.jsx";
import AdminLogin from "./component/componentAdmin/AdminLogin.jsx";
import ProtectedRoute from "./component/componentAdmin/ProtectedRoute.jsx";
import NotFoundPage from "./pagesUser/NotFoundPage.jsx";
import AddNewCategoryPage from "./pagesAdmin/AddNewCategoryPage.jsx";
import CategoryListPage from "./pagesAdmin/CategoryListPage.jsx";
import EditCategoryPage from "./pagesAdmin/EditCategoryPage.jsx";
import AddNewSubCategoryPage from "./pagesAdmin/AddNewSubCategoryPage.jsx";
import SubCategoryListPage from "./pagesAdmin/SubCategoryListPage.jsx";
import EditSubCategoryPage from "./pagesAdmin/EditSubCategoryPage.jsx";
import ChildCategoryListPage from "./pagesAdmin/ChildCategoryListPage.jsx";
import AddNewChildCategoryPage from "./pagesAdmin/AddNewChildCategoryPage.jsx";
import EditChildCategoryPage from "./pagesAdmin/EditChildCategoryPage.jsx";
import AddNewProductSizePage from "./pagesAdmin/AddNewProductSizePage.jsx";
import ProductSizeListPage from "./pagesAdmin/ProductSizeListPage.jsx";
import EditProductSizePage from "./pagesAdmin/EditProductSizePage.jsx";
import ProductFlagPage from "./pagesAdmin/ProductFlagPage.jsx";
import ShopPage from "./pagesUser/ShopPage.jsx";
import AddNewProductPage from "./pagesAdmin/AddNewProductPage.jsx";
import ProductDetailsPage from "./pagesUser/ProductDetailsPage.jsx";
import ViewAllProductPage from "./pagesAdmin/ViewAllProductPage.jsx";
import EditProductPage from "./pagesAdmin/EditProductPage.jsx";
import LoginPage from "./pagesUser/LoginPage.jsx";
import RegisterPage from "./pagesUser/RegisterPage.jsx";
import CustomerListPage from "./pagesAdmin/CustomerListPage.jsx";
import UserLayout from "./component/componentGeneral/UserLayout.jsx";
import UserProtectedRoute from "./component/componentGeneral/UserProtectedRoute.jsx";
import UserHomePage from "./pagesUser/UserHomePage.jsx";

function App() {
  const { GeneralInfoListRequest } = GeneralInfoStore();
  const { CarouselStoreListRequest } = CarouselStore();
  const { FeatureStoreListRequest } = FeatureStore();
  const { fetchColors, colors } = useColorStore(); // ✅ Extract colors
  const { fetchSocialMediaLinks } = useSocialMediaLinkStore();
  const { fetchCategories } = CategoryStore();
  const { fetchSubCategories } = SubCategoryStore();
  const { fetchProductSizes } = useProductSizeStore();
  const { fetchFlags } = useFlagStore();
  const { fetchChildCategories } = useChildCategoryStore();
  const { fetchProducts, fetchProductsAdmin } = useProductStore();
  const { initialize } = useAuthUserStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          GeneralInfoListRequest(),
          CarouselStoreListRequest(),
          FeatureStoreListRequest(),
          fetchColors(),
          fetchSocialMediaLinks(),
          fetchCategories(),
          fetchSubCategories(),
          fetchProductSizes(),
          fetchFlags(),
          fetchChildCategories(),
          fetchProducts(),
          fetchProductsAdmin(),
          initialize(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // ✅ Empty dependency array to prevent unnecessary re-renders

  useEffect(() => {
    if (colors) {
      document.documentElement.style.setProperty(
        "--primaryColor",
        colors.primaryColor,
      );
      document.documentElement.style.setProperty(
        "--secondaryColor",
        colors.secondaryColor,
      );
      document.documentElement.style.setProperty(
        "--tertiaryColor",
        colors.tertiaryColor,
      );
      document.documentElement.style.setProperty(
        "--accentColor",
        colors.accentColor,
      );
    }
  }, [colors]); // ✅ This effect will run only when colors change

  return (
    <Router>
      <Routes>
        {/* General User Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:slug" element={<ProductDetailsPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected User Routes */}
        <Route element={<UserProtectedRoute />}>
          <Route path="/user/home" element={<UserHomePage />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/general-info" element={<GeneralInfoPage />} />
          <Route
            path="/admin/subscribed-users"
            element={<SubscribedUsersPage />}
          />
          <Route path="/admin/color-updater" element={<ColorUpdaterPage />} />
          <Route
            path="/admin/social-link-updater"
            element={<SocialLinkUpdaterPage />}
          />
          <Route path="/admin/sliders-banners" element={<SliderBannerPage />} />
          <Route
            path="/admin/contact-request"
            element={<ContactRequestPage />}
          />

          {/* Category Routes */}
          <Route
            path="/admin/addnewcategory"
            element={<AddNewCategoryPage />}
          />
          <Route path="/admin/categorylist" element={<CategoryListPage />} />
          <Route
            path="/admin/edit-category/:id"
            element={<EditCategoryPage />}
          />

          {/* SubCategory Routes */}
          <Route
            path="/admin/addnewsubcategory"
            element={<AddNewSubCategoryPage />}
          />
          <Route
            path="/admin/edit-subcategory/:id"
            element={<EditSubCategoryPage />}
          />
          <Route
            path="/admin/subcategorylist"
            element={<SubCategoryListPage />}
          />

          {/* Child Category Routes */}
          <Route
            path="/admin/childcategorylist"
            element={<ChildCategoryListPage />}
          />
          <Route
            path="/admin/addnewchildcategory"
            element={<AddNewChildCategoryPage />}
          />
          <Route
            path="/admin/edit-child-category/:id"
            element={<EditChildCategoryPage />}
          />

          {/* Product Size Routes */}
          <Route
            path="/admin/add-product-size"
            element={<AddNewProductSizePage />}
          />
          <Route
            path="/admin/product-sizes"
            element={<ProductSizeListPage />}
          />
          <Route
            path="/admin/edit-product-size/:id"
            element={<EditProductSizePage />}
          />

          {/* Product Flag Routes */}
          <Route path="/admin/product-flags" element={<ProductFlagPage />} />

          {/* Product Routes */}
          <Route path="/admin/addnewproduct" element={<AddNewProductPage />} />
          <Route
            path="/admin/viewallproducts"
            element={<ViewAllProductPage />}
          />
          <Route
            path="/admin/edit-product/:slug"
            element={<EditProductPage />}
          />
          <Route path="/admin/customers" element={<CustomerListPage />} />
        </Route>

        {/* Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
