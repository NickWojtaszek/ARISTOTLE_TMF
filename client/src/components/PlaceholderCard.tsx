import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import { Link } from 'wouter';

interface PlaceholderCardProps {
  title: string;
  description: string;
  type: string;
  color?: string;
  viewMode?: 'grid' | 'list';
}

export default function PlaceholderCard({ 
  title, 
  description, 
  type, 
  color = '#6B7280',
  viewMode = 'grid' 
}: PlaceholderCardProps) {
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'Standardowe Procedury Operacyjne':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6h-3a1 1 0 100 2h3v3a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H8z" />
          </svg>
        );
      case 'Protokoły Badania':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 7a1 1 0 011-1h12a1 1 0 011 1v6h-2V9a1 1 0 00-1-1H6a1 1 0 00-1 1v4H3V7z" clipRule="evenodd" />
          </svg>
        );
      case 'Formularze CRF':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        );
      case 'Dokumenty Regulacyjne':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        );
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const listView = (
    <div className="bg-gray-50 border-l-4 border-dashed rounded-lg p-4 transition-all duration-300 hover:shadow-md shadow-sm border-gray-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 opacity-60"
            style={{ backgroundColor: color }}
          >
            {getDocumentIcon(type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-600 truncate flex-1">
                {title}
              </h3>
              <div 
                className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0"
                title="Dokument do utworzenia"
              >
                <Plus className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="font-mono text-gray-400">Do utworzenia</span>
              <span>Typ: {type}</span>
            </div>
          </div>
          <div className="hidden lg:block flex-1 min-w-0 max-w-md">
            <p className="text-sm text-gray-500 truncate">
              {description}
            </p>
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <Link href="/add-document">
            <Button className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              <Plus className="w-4 h-4" />
              Utwórz
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  const gridView = (
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 shadow-sm group">
      <div className="flex items-start gap-4 mb-4">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0 opacity-60"
          style={{ backgroundColor: color }}
        >
          {getDocumentIcon(type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-600 line-clamp-2 flex-1">
              {title}
            </h3>
            <div 
              className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5"
              title="Dokument do utworzenia"
            >
              <Plus className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="inline-block font-mono text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded font-medium">
            Do utworzenia
          </div>
        </div>
      </div>
      
      <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed">
        {description}
      </p>
      
      <div className="flex justify-between items-center text-xs text-gray-400 mb-4 pt-3 border-t border-gray-200">
        <span>Do utworzenia</span>
        <span>Typ: {type}</span>
      </div>
      
      <div className="flex gap-2 pt-2">
        <Link href="/add-document" className="flex-1">
          <Button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" />
            Utwórz dokument
          </Button>
        </Link>
      </div>
    </div>
  );

  return viewMode === 'list' ? listView : gridView;
}