import React from "react";
import Layout from "../component/componentGeneral/Layout.jsx";
import ProductCarousel from "../component/componentGeneral/ProductCarousel.jsx";
import Feature from "../component/componentGeneral/Feature.jsx";
import UserProfile from "../component/skeleton/UserProfile.jsx";
import LoginForm from "../component/componentGeneral/LoginForm.jsx";

const HomePage = () => {

  return (
    <Layout>
      <ProductCarousel />
      <Feature />
      <UserProfile />
      <LoginForm />
    </Layout>
  );
};

export default HomePage;
