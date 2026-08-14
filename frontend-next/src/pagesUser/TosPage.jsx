'use client';
import React from 'react';

import PublicContentViewer from '../component/componentGeneral/PublicContentViewer.jsx';

const HomePage = ({ initialContent = '' }) => {
  return (
    <>
      <PublicContentViewer title="Terms of Services" endpoint="terms" initialContent={initialContent} />
    </>
  );
};

export default HomePage;
