import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GripVertical, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DocumentType } from '@shared/schema';

interface DocumentTypeSortManagerProps {
  onClose?: () => void;
}

export default function DocumentTypeSortManager({ onClose }: DocumentTypeSortManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: documentTypes = [], isLoading } = useQuery<DocumentType[]>({
    queryKey: ['/api/document-types'],
  });

  const [sortedTypes, setSortedTypes] = useState<DocumentType[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize sorted types when data loads
  useEffect(() => {
    if (documentTypes.length > 0) {
      const sorted = [...documentTypes].sort((a, b) => a.sortOrder - b.sortOrder);
      setSortedTypes(sorted);
    }
  }, [documentTypes]);

  const updateSortOrderMutation = useMutation({
    mutationFn: async (updates: { id: number; sortOrder: number }[]) => {
      // Update each document type's sort order
      await Promise.all(
        updates.map(({ id, sortOrder }) =>
          fetch(`/api/document-types/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sortOrder })
          })
        )
      );
    },
    onSuccess: () => {
      toast({
        title: "Sukces",
        description: "Kolejność typów dokumentów została zaktualizowana",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/document-types'] });
      setHasChanges(false);
      if (onClose) onClose();
    },
    onError: () => {
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować kolejności",
        variant: "destructive",
      });
    },
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newSortedTypes = Array.from(sortedTypes);
    const [reorderedItem] = newSortedTypes.splice(result.source.index, 1);
    newSortedTypes.splice(result.destination.index, 0, reorderedItem);

    setSortedTypes(newSortedTypes);
    setHasChanges(true);
  };

  const handleSave = () => {
    const updates = sortedTypes.map((type, index) => ({
      id: type.id,
      sortOrder: index
    }));
    updateSortOrderMutation.mutate(updates);
  };

  const handleReset = () => {
    const sorted = [...documentTypes].sort((a, b) => a.sortOrder - b.sortOrder);
    setSortedTypes(sorted);
    setHasChanges(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(217,91%,60%)]"></div>
        <span className="ml-2">Ładowanie typów dokumentów...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Kolejność typów dokumentów</h3>
          <p className="text-sm text-gray-600">
            Przeciągnij i upuść aby zmienić kolejność wyświetlania w górnym pasku nawigacji
          </p>
        </div>
        
        <div className="flex gap-2">
          {hasChanges && (
            <Button variant="outline" onClick={handleReset}>
              Resetuj
            </Button>
          )}
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges || updateSortOrderMutation.isPending}
            className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,50%)]"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateSortOrderMutation.isPending ? 'Zapisywanie...' : 'Zapisz kolejność'}
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="document-types">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {sortedTypes.map((type, index) => (
                <Draggable 
                  key={type.id.toString()} 
                  draggableId={type.id.toString()} 
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${
                        snapshot.isDragging ? 'shadow-lg rotate-1 scale-105' : ''
                      } transition-all duration-200`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100"
                          >
                            <GripVertical className="w-5 h-5 text-gray-400" />
                          </div>
                          
                          <div className="flex-1">
                            <CardTitle className="text-base flex items-center gap-2">
                              {type.displayName}
                              <Badge variant="secondary" className="text-xs">
                                #{index + 1}
                              </Badge>
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                              ID: {type.name} {type.description && `• ${type.description}`}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {sortedTypes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Brak typów dokumentów do sortowania.
        </div>
      )}
    </div>
  );
}