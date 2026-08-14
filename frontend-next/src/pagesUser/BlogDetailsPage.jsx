'use client';
import React from 'react';
import BlogDetails from '../component/componentGeneral/BlogDetails.jsx';

const BlogDetailsPage = ({ initialData = null }) => {
  return (
    <>
      <BlogDetails initialData={initialData} />
    </>
  );
};

export default BlogDetailsPage;
