import React from 'react';
import LayoutAdmin from "../component/componentAdmin/LayoutAdmin.jsx";
import Breadcrumb from "../component/componentAdmin/Breadcrumb.jsx";
import BlogList from "../component/componentAdmin/BlogList.jsx";

const BlogsListPage = () => {
  return (
    <LayoutAdmin>
      <div>
        <Breadcrumb title={"Create a Blog"} pageDetails={"BLOGS"} />
        <BlogList/>
      </div>
    </LayoutAdmin>
  );
};

export default BlogsListPage;