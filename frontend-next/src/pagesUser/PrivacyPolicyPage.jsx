'use client';
import React from 'react';

import PublicContentViewer from '../component/componentGeneral/PublicContentViewer.jsx';

const HomePage = ({ initialContent = '' }) => {
  return (
    <>
      <PublicContentViewer title="Privacy Policy" endpoint="privacy" initialContent={initialContent} />
    </>
  );
};

export default HomePage;
