import { DocumentCategory } from '@/types/document';
import { useQuery } from '@tanstack/react-query';
import { DocumentType } from '@shared/schema';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const { data: documentTypes = [], isLoading } = useQuery<DocumentType[]>({
    queryKey: ['/api/document-types'],
  });

  // Map document types to tabs with icons
  const getIconForType = (displayName: string) => {
    if (displayName.toLowerCase().includes('sop') || displayName.toLowerCase().includes('procedur')) return 'clipboard-list';
    if (displayName.toLowerCase().includes('protokoł')) return 'file-medical';
    if (displayName.toLowerCase().includes('formularz') || displayName.toLowerCase().includes('crf')) return 'wpforms';
    if (displayName.toLowerCase().includes('regulacyjn')) return 'gavel';
    return 'file-text'; // default icon
  };

  // Sort document types by sortOrder field for display
  const sortedDocumentTypes = [...documentTypes].sort((a, b) => a.sortOrder - b.sortOrder);
  
  const tabs = sortedDocumentTypes.map((type) => ({
    id: type.displayName,
    label: type.displayName,
    icon: getIconForType(type.displayName)
  }));

  if (isLoading) {
    return (
      <nav className="bg-[hsl(210,40%,98%)] border-b border-[hsl(214,32%,91%)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[hsl(217,91%,60%)]"></div>
            <span className="ml-2 text-[hsl(215,25%,27%)]">Ładowanie typów dokumentów...</span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-[hsl(210,40%,98%)] border-b border-[hsl(214,32%,91%)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4 justify-start">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 min-w-[200px] flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[hsl(217,91%,60%)] text-white border-[hsl(217,91%,60%)]'
                  : 'bg-white text-[hsl(215,25%,27%)] border-[hsl(214,32%,91%)] hover:bg-[hsl(217,91%,60%)] hover:text-white hover:border-[hsl(217,91%,60%)]'
              } border`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                {tab.icon === 'clipboard-list' && (
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6h-3a1 1 0 100 2h3v3a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H8z" />
                )}
                {tab.icon === 'file-medical' && (
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 7a1 1 0 011-1h12a1 1 0 011 1v6h-2V9a1 1 0 00-1-1H6a1 1 0 00-1-1v4H3V7z" clipRule="evenodd" />
                )}
                {tab.icon === 'wpforms' && (
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                )}
                {tab.icon === 'gavel' && (
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                )}
                {tab.icon === 'file-text' && (
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                )}
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
