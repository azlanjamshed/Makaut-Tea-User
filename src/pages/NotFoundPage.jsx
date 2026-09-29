import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-12 max-w-md mx-auto">
      <span className="text-6xl mb-4 select-none">🏚️</span>
      <h1 className="text-4xl font-extrabold text-white font-display mb-2">
        404
      </h1>
      <h2 className="text-lg font-bold text-slate-200 mb-2">
        Lost in the campus corridors?
      </h2>
      <p className="text-xs sm:text-sm text-slate-400 mb-8 max-w-xs leading-relaxed">
        The rant, page, or profile you're looking for doesn't exist or has been deleted by its author.
      </p>
      <Link to="/">
        <Button variant="primary" size="md" icon={Home}>
          Back to Campus Feed
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
