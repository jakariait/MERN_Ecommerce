import React from "react";
import UserLayout from "../component/componentGeneral/UserLayout.jsx";
import UserStats from "../component/componentGeneral/UserStats.jsx";

const UserHomePage = () => {
  return (
    <UserLayout>
      <UserStats />
    </UserLayout>
  );
};

export default UserHomePage;
