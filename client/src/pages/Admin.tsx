import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import {
  Document,
  DocumentType,
  insertDocumentSchema,
  insertDocumentTypeSchema,
  InsertDocument,
  InsertDocumentType
} from '@shared/schema';
import DocumentForm from '@/components/DocumentForm';
import Header from '@/components/Header';
import EditDocumentDialog from '@/components/EditDocumentDialog';
import EditDocumentTypeDialog from '@/components/EditDocumentTypeDialog';
import DocumentTypeSortManager from '@/components/DocumentTypeSortManager';
import { Pencil, Trash2, Plus, FileText, Type, ArrowLeft, Grid3X3, List, Edit, ExternalLink, ArrowUpDown } from 'lucide-react';
import { Link } from 'wouter';

// Document Type Management Component
function DocumentTypeManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTypeId, setEditingTypeId] = useState<number | null>(null);
  const [showSortManager, setShowSortManager] = useState(false);

  const form = useForm<InsertDocumentType>({
    resolver: zodResolver(insertDocumentTypeSchema),
    defaultValues: {
      name: '',
      displayName: '',
      description: '',
    },
  });

  const { data: documentTypes = [], isLoading } = useQuery<DocumentType[]>({
    queryKey: ['/api/document-types'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertDocumentType) => {
      return await apiRequest('POST', '/api/document-types', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/document-types'] });
      toast({ title: 'Sukces', description: 'Typ dokumentu został dodany' });
      form.reset();
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ title: 'Błąd', description: 'Nie udało się dodać typu dokumentu', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest('DELETE', `/api/document-types/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/document-types'] });
      toast({ title: 'Sukces', description: 'Typ dokumentu został usunięty' });
    },
    onError: () => {
      toast({ title: 'Błąd', description: 'Nie udało się usunąć typu dokumentu', variant: 'destructive' });
    },
  });

  const onSubmit = async (data: InsertDocumentType) => {
    await createMutation.mutateAsync(data);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Czy na pewno chcesz usunąć ten typ dokumentu?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Zarządzanie typami dokumentów</h2>
          <p className="text-gray-600">Dodawaj i zarządzaj typami dokumentów</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowSortManager(true)}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            Uporządkuj
          </Button>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Dodaj typ dokumentu
          </Button>
        </div>
      </div>

      {/* Sort Manager Section */}
      {showSortManager ? (
        <div className="bg-white border rounded-lg p-6">
          <DocumentTypeSortManager onClose={() => setShowSortManager(false)} />
        </div>
      ) : (
        <>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dodaj nowy typ dokumentu</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nazwa systemu *</FormLabel>
                        <FormControl>
                          <Input placeholder="np. SOP" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nazwa wyświetlana *</FormLabel>
                        <FormControl>
                          <Input placeholder="np. Standardowe Procedury Operacyjne" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opis</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Opis typu dokumentu..." {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2 pt-4">
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending}
                      className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,50%)]"
                    >
                      {createMutation.isPending ? 'Dodawanie...' : 'Dodaj typ'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Anuluj
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <div className="grid grid-cols-1 gap-4">
            {documentTypes.map((type) => (
              <Card key={type.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{type.displayName}</CardTitle>
                      <CardDescription className="mt-1">
                        ID: {type.name} | {type.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingTypeId(type.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(type.id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {documentTypes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Brak typów dokumentów. Dodaj pierwszy typ powyżej.
            </div>
          )}

          <EditDocumentTypeDialog
            documentTypeId={editingTypeId}
            isOpen={editingTypeId !== null}
            onClose={() => setEditingTypeId(null)}
          />
        </>
      )}
    </div>
  );
}

// Document List Management Component
function DocumentListManager() {
  const { data: documents = [], isLoading } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [editingDocumentId, setEditingDocumentId] = useState<number | null>(null);

  if (isLoading) {
    return <div className="flex justify-center p-8">Ładowanie dokumentów...</div>;
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Standardowe Procedury Operacyjne':
        return 'bg-blue-100 text-blue-800';
      case 'Protokoły Badania':
        return 'bg-green-100 text-green-800';
      case 'Formularze CRF':
        return 'bg-yellow-100 text-yellow-800';
      case 'Dokumenty Regulacyjne':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Lista dokumentów</h2>
          <p className="text-gray-600">Wszystkie dokumenty w systemie ({documents.length})</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-3"
      }>
        {documents.map((doc) => (
          <Card key={doc.id} className={viewMode === 'list' ? 'flex' : ''}>
            <CardHeader className={viewMode === 'list' ? 'flex-1' : ''}>
              <div className="flex items-start justify-between">
                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  <CardTitle className="text-base">{doc.title}</CardTitle>
                  <CardDescription className="mt-1">
                    <span className="font-mono text-xs text-gray-400">{doc.code}</span>
                    {doc.userCode && <span className="font-mono text-[hsl(217,91%,60%)] ml-2">{doc.userCode}</span>}
                    <span className="ml-2">| v.{doc.version}</span>
                  </CardDescription>
                  <Badge className={`mt-2 ${getTypeColor(doc.type)}`}>
                    {doc.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingDocumentId(doc.id)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert('Funkcja podglądu w przygotowaniu')}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {documents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Brak dokumentów w systemie.
        </div>
      )}

      <EditDocumentDialog
        documentId={editingDocumentId}
        isOpen={editingDocumentId !== null}
        onClose={() => setEditingDocumentId(null)}
      />
    </div>
  );
}

export default function Admin() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4" />
            Powrót do strony głównej
          </Link>
        </div>

        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Panel Administracyjny</h1>
            <p className="text-gray-600 mt-2">Zarządzaj typami dokumentów i zawartością systemu</p>
          </div>

          <Tabs defaultValue="document-types" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="document-types" className="flex items-center gap-2">
                <Type className="w-4 h-4" />
                Typy dokumentów
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Lista dokumentów
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="document-types" className="mt-6">
              <DocumentTypeManager />
            </TabsContent>
            
            <TabsContent value="documents" className="mt-6">
              <DocumentListManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}