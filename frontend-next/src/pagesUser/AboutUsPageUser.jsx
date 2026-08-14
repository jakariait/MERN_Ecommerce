'use client';
import React from 'react';

import PublicContentViewer from '../component/componentGeneral/PublicContentViewer.jsx';

const HomePage = ({ initialContent = '' }) => {
  return (
    <>
      <PublicContentViewer title="About Us" endpoint="about" initialContent={initialContent} />
    </>
  );
};

export default HomePage;
