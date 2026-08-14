'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 p-6 text-center">
      <h2 className="text-xl font-semibold text-gray-800">
        Something went wrong
      </h2>
      <p className="text-gray-500 text-sm">
        We could not load this page right now. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:opacity-90"
      >
        Try again
      </button>
    </div>
  );
}
