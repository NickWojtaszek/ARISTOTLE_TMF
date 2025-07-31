import { Document, DocumentCategory, FilterType } from '@/types/document';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useState } from 'react';
import DocumentCard from './DocumentCard';
import PlaceholderCard from './PlaceholderCard';
import EditDocumentDialog from './EditDocumentDialog';
import { apiRequest } from '@/lib/queryClient';

interface DocumentGridProps {
  activeTab: string;
  searchTerm: string;
  activeFilter: FilterType;
  viewMode?: 'grid' | 'list';
}

export default function DocumentGrid({ activeTab, searchTerm, activeFilter, viewMode = 'grid' }: DocumentGridProps) {
  const queryClient = useQueryClient();
  const [editingDocumentId, setEditingDocumentId] = useState<number | null>(null);
  const { data: allDocuments = [], isLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });

  const updateSortOrderMutation = useMutation({
    mutationFn: async ({ documentId, sortOrder }: { documentId: number, sortOrder: number }) => {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sortOrder })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
    }
  });

  const getTabTitle = (tab: string) => {
    return tab; // activeTab is now the display name directly
  };

  const getTabDescription = (tab: string) => {
    if (tab.includes('SOP') || tab.includes('Procedur')) {
      return 'Procedury regulujące przeprowadzenie badania klinicznego';
    } else if (tab.includes('Protokoł')) {
      return 'Główne dokumenty opisujące design i przeprowadzenie badania';
    } else if (tab.includes('Formularz') || tab.includes('CRF')) {
      return 'Case Report Forms - formularze zbierania danych pacjentów';
    } else if (tab.includes('Regulacyjn')) {
      return 'Dokumenty wymagane przez organy regulacyjne';
    }
    return 'Dokumenty w systemie TMF';
  };

  const filterDocuments = (docs: Document[]) => {
    return docs.filter(doc => {
      // Tab filter - now activeTab is directly the document type display name
      const matchesTab = doc.type === activeTab;

      // Search filter
      const matchesSearch = searchTerm === '' || 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.userCode && doc.userCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Additional filter
      const matchesFilter = activeFilter === 'all' || 
        (activeFilter === 'current' && doc.status === 'Aktualna') ||
        (activeFilter === 'archived' && doc.status === 'Archiwalna');

      return matchesTab && matchesSearch && matchesFilter;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(217,91%,60%)] mx-auto mb-4"></div>
          <p className="text-[hsl(215,25%,27%)]">Ładowanie dokumentów...</p>
        </div>
      </div>
    );
  }

  const filteredDocs = filterDocuments(allDocuments).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(filteredDocs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update sort orders for all affected documents
    items.forEach((doc, index) => {
      if (doc.sortOrder !== index) {
        updateSortOrderMutation.mutate({
          documentId: doc.id,
          sortOrder: index
        });
      }
    });
  };

  // Define placeholder documents for missing types
  const getPlaceholders = () => {
    const placeholders = [];
    
    if (activeTab === 'Dokumenty Regulacyjne') {
      // Always show regulatory placeholders since these are commonly needed
      placeholders.push(
        {
          title: "Zgoda Komisji Bioetycznej",
          description: "Dokument zatwierdzający przeprowadzenie badania klinicznego przez komisję bioetyczną",
          type: "Dokumenty Regulacyjne",
          color: "#EF4444"
        },
        {
          title: "Pozwolenie URPL",
          description: "Pozwolenie Urzędu Rejestracji Produktów Leczniczych na przeprowadzenie badania",
          type: "Dokumenty Regulacyjne",
          color: "#EF4444"
        },
        {
          title: "Ubezpieczenie Badania",
          description: "Polisa ubezpieczeniowa pokrywająca odpowiedzialność cywilną w trakcie badania",
          type: "Dokumenty Regulacyjne", 
          color: "#EF4444"
        }
      );
    }
    
    if (activeTab === 'Protokoły Badania' && filteredDocs.length < 3) {
      // Add protocol placeholders if needed
      placeholders.push(
        {
          title: "Protokół Amandment",
          description: "Dokument modyfikujący główny protokół badania klinicznego",
          type: "Protokoły Badania",
          color: "#10B981"
        }
      );
    }
    
    if (activeTab === 'Formularze CRF' && filteredDocs.length < 5) {
      // Add common CRF placeholders
      placeholders.push(
        {
          title: "CRF - Wizyta Końcowa",
          description: "Formularz dokumentujący końcową wizytę pacjenta w badaniu",
          type: "Formularze CRF",
          color: "#F59E0B"
        }
      );
    }
    
    return placeholders;
  };

  const placeholders = getPlaceholders();

  return (
    <div>
      <div className="text-left mb-8">
        <h2 className="text-2xl font-semibold text-[hsl(222,84%,5%)] mb-2">
          {getTabTitle(activeTab)}
        </h2>
        <p className="text-[hsl(215,25%,27%)]">
          {getTabDescription(activeTab)}
        </p>
      </div>

      {filteredDocs.length === 0 && placeholders.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-[hsl(215,25%,52%)] mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <p className="text-[hsl(215,25%,27%)]">
            Nie znaleziono dokumentów spełniających kryteria wyszukiwania.
          </p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="documents" direction={viewMode === 'grid' ? 'horizontal' : 'vertical'}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12"
                    : "grid grid-cols-1 gap-3 mb-12"
                }
              >
                {filteredDocs.map((doc, index) => (
                  <Draggable key={doc.id.toString()} draggableId={doc.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          transform: snapshot.isDragging ? provided.draggableProps.style?.transform : 'none',
                        }}
                        className={snapshot.isDragging ? 'z-50 rotate-2 scale-105' : ''}
                      >
                        <DocumentCard 
                          document={doc} 
                          viewMode={viewMode} 
                          onEditClick={setEditingDocumentId}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                {/* Show placeholders only when not searching */}
                {searchTerm === '' && activeFilter === 'all' && placeholders.map((placeholder, index) => (
                  <PlaceholderCard
                    key={`placeholder-${index}`}
                    title={placeholder.title}
                    description={placeholder.description}
                    type={placeholder.type}
                    color={placeholder.color}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <EditDocumentDialog
        documentId={editingDocumentId}
        isOpen={editingDocumentId !== null}
        onClose={() => setEditingDocumentId(null)}
      />

      {/* Reference Documents for SOPs tab */}
      {activeTab === 'Standardowe Procedury Operacyjne' && (
        <div className="bg-[hsl(210,40%,98%)] rounded-xl p-6">
          <h3 className="text-xl font-semibold text-[hsl(222,84%,5%)] mb-4 text-center">
            Dokumenty Referencyjne
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: 'ICH GCP E6(R2)',
                description: 'Międzynarodowe wytyczne dobrej praktyki klinicznej'
              },
              {
                title: 'Dyrektywa 2001/20/EC',
                description: 'Europejska dyrektywa o badaniach klinicznych'
              },
              {
                title: 'Ustawa o produktach leczniczych',
                description: 'Polskie przepisy dotyczące badań klinicznych'
              },
              {
                title: 'Rozporządzenie UE 536/2014',
                description: 'Europejskie rozporządzenie CTR'
              }
            ].map((ref, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-[hsl(214,32%,91%)] text-center">
                <h4 className="text-sm font-semibold text-[hsl(222,84%,5%)] mb-2">
                  {ref.title}
                </h4>
                <p className="text-xs text-[hsl(215,25%,27%)]">
                  {ref.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
