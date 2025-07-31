import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import SearchFilters from '@/components/SearchFilters';
import DocumentGrid from '@/components/DocumentGrid';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Plus, Grid3X3, List } from 'lucide-react';
import { DocumentCategory, FilterType } from '@/types/document';
import { DocumentType } from '@shared/schema';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Query to get document types for setting default active tab
  const { data: documentTypes = [] } = useQuery<DocumentType[]>({
    queryKey: ['/api/document-types'],
  });

  // Set default active tab to first document type when loaded
  useEffect(() => {
    if (documentTypes.length > 0 && !activeTab) {
      const sortedTypes = [...documentTypes].sort((a, b) => a.sortOrder - b.sortOrder);
      setActiveTab(sortedTypes[0].displayName);
    }
  }, [documentTypes, activeTab]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <SearchFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="h-8 px-3"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="h-8 px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <Link href="/add-document">
              <Button className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,50%)] flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Dodaj dokument
              </Button>
            </Link>
          </div>
        </div>
        
        <DocumentGrid 
          activeTab={activeTab}
          searchTerm={searchTerm}
          activeFilter={activeFilter}
          viewMode={viewMode}
        />
      </main>
      
      <Footer />
    </div>
  );
}
