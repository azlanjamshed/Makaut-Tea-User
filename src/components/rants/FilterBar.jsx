import React from 'react';
import { DEPARTMENTS } from '../../utils/constants';

const FilterBar = ({ selectedDepartment = 'All', onSelectDepartment, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto no-scrollbar py-1 ${className}`}>
      <div className="flex items-center gap-2 px-1 w-max">
        {DEPARTMENTS.map((dept) => {
          const isSelected = selectedDepartment === dept || (!selectedDepartment && dept === 'All');

          return (
            <button
              key={dept}
              type="button"
              onClick={() => onSelectDepartment(dept)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 select-none ${
                isSelected
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-white border border-[var(--border-color)] text-slate-700 hover:text-slate-900 hover:border-slate-300 active:scale-95'
              }`}
            >
              {dept}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;
