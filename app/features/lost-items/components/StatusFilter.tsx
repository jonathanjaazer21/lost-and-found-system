interface StatusFilterProps {
  currentFilter: 'all' | 'unclaimed' | 'claimed';
  onFilterChange: (filter: 'all' | 'unclaimed' | 'claimed') => void;
}

export function StatusFilter({ currentFilter, onFilterChange }: StatusFilterProps) {
  return (
    <div className="flex gap-2">
      <button
        className={`btn btn-sm ${currentFilter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
        onClick={() => onFilterChange('all')}
      >
        All
      </button>
      <button
        className={`btn btn-sm ${currentFilter === 'unclaimed' ? 'btn-primary' : 'btn-ghost'}`}
        onClick={() => onFilterChange('unclaimed')}
      >
        Unclaimed
      </button>
      <button
        className={`btn btn-sm ${currentFilter === 'claimed' ? 'btn-primary' : 'btn-ghost'}`}
        onClick={() => onFilterChange('claimed')}
      >
        Claimed
      </button>
    </div>
  );
}
