'use client';
import React from 'react';

import PublicContentViewer from '../component/componentGeneral/PublicContentViewer.jsx';

const HomePage = ({ initialContent = '' }) => {
  return (
    <>
      <PublicContentViewer title="Refund Policy" endpoint="refund" initialContent={initialContent} />
    </>
  );
};

export default HomePage;
