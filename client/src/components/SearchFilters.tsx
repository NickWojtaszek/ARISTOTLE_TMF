import { FilterType } from '@/types/document';

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function SearchFilters({ 
  searchTerm, 
  onSearchChange, 
  activeFilter, 
  onFilterChange 
}: SearchFiltersProps) {
  const filters = [
    { id: 'all' as FilterType, label: 'Wszystkie' },
    { id: 'sop' as FilterType, label: 'SOP' },
    { id: 'protocol' as FilterType, label: 'Protokoły' },
    { id: 'form' as FilterType, label: 'Formularze' },
    { id: 'regulatory' as FilterType, label: 'Regulacyjne' },
    { id: 'current' as FilterType, label: 'Aktualne' },
    { id: 'archived' as FilterType, label: 'Archiwalne' }
  ];

  return (
    <div className="bg-white border border-[hsl(214,32%,91%)] rounded-xl p-6 mb-8 shadow-sm">
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Wyszukaj dokumenty..."
          className="w-full px-4 py-3 border border-[hsl(214,32%,91%)] rounded-lg text-base focus:outline-none focus:ring-3 focus:ring-[hsl(217,91%,60%)] focus:ring-opacity-10 focus:border-[hsl(217,91%,60%)] transition-all"
        />
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-3 py-2 rounded-full text-sm cursor-pointer transition-all duration-200 border ${
              activeFilter === filter.id
                ? 'bg-[hsl(217,91%,60%)] text-white border-[hsl(217,91%,60%)]'
                : 'bg-[hsl(210,40%,98%)] text-[hsl(215,25%,27%)] border-[hsl(214,32%,91%)] hover:bg-[hsl(217,91%,60%)] hover:text-white hover:border-[hsl(217,91%,60%)]'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
