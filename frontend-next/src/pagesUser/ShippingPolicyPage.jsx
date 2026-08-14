'use client';
import React from 'react';

import PublicContentViewer from '../component/componentGeneral/PublicContentViewer.jsx';

const HomePage = ({ initialContent = '' }) => {
  return (
    <>
      <PublicContentViewer title="Shipping Policy" endpoint="shipping" initialContent={initialContent} />
    </>
  );
};

export default HomePage;
