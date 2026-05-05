interface TimeFilterBarProps {
  selected: string;
  onSelect: (filter: string) => void;
}

const filters = [
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
  { label: '6M', value: '6M' },
  { label: 'YTD', value: 'YTD' },
  { label: '1Y', value: '1Y' },
  { label: '3Y', value: '3Y' },
  { label: '5Y', value: '5Y' },
  { label: 'Max', value: 'Max' },
  { label: 'Latest', value: 'latest' },
];

export function TimeFilterBar({ selected, onSelect }: TimeFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onSelect(filter.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            selected === filter.value
              ? 'bg-[var(--primary)] text-white'
              : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
