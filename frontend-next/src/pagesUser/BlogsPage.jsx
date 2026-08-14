'use client';
import React from 'react';
import AllBlogs from '../component/componentGeneral/AllBlogs.jsx';

const BlogsPage = ({ initialData = null }) => {
  return (
    <>
      <AllBlogs initialData={initialData} />
    </>
  );
};

export default BlogsPage;
