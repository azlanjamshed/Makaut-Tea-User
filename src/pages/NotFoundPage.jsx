import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Home, Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-12 max-w-md mx-auto">
      <div className="w-20 h-20 rounded-3xl bg-purple-50 border border-[var(--border-color)] flex items-center justify-center text-[var(--color-primary)] mb-6 shadow-sm">
        <Compass className="w-10 h-10 stroke-[1.5]" />
      </div>
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
