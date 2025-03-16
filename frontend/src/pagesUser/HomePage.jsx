import React from "react";
import Layout from "../component/componentGeneral/Layout.jsx";
import ProductCarousel from "../component/componentGeneral/ProductCarousel.jsx";
import Feature from "../component/componentGeneral/Feature.jsx";
import UserProfile from "../component/skeleton/UserProfile.jsx";

const HomePage = () => {

  return (
    <Layout>
      <ProductCarousel />
      <Feature />
      <UserProfile />
    </Layout>
  );
};

export default HomePage;
