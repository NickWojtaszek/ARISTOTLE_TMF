import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Document } from '@/types/document';

// Rozszerzone schema do edycji dokumentu
const editDocumentSchema = z.object({
  title: z.string().min(1, 'Tytuł jest wymagany'),
  userCode: z.string().optional(),
  description: z.string().min(1, 'Opis jest wymagany'),
  version: z.string().min(1, 'Wersja jest wymagana'),
  date: z.string().min(1, 'Data jest wymagana'),
  status: z.enum(['Aktualna', 'Archiwalna']),
  type: z.enum(['Standardowe Procedury Operacyjne', 'Protokoły Badania', 'Formularze CRF', 'Dokumenty Regulacyjne']),
  color: z.string().min(1, 'Kolor jest wymagany'),
  googleDocsUrl: z.string().optional(),
});

type EditDocumentData = z.infer<typeof editDocumentSchema>;

export default function EditDocument() {
  const [, params] = useRoute('/documents/edit/:id');
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const documentId = params?.id ? parseInt(params.id) : null;

  const { data: document, isLoading, error } = useQuery<Document>({
    queryKey: ['/api/documents', documentId],
    queryFn: async () => {
      if (!documentId) throw new Error('Brak ID dokumentu');
      const response = await fetch(`/api/documents/${documentId}`);
      if (!response.ok) throw new Error('Nie udało się pobrać dokumentu');
      return response.json();
    },
    enabled: !!documentId,
  });

  const form = useForm<EditDocumentData>({
    resolver: zodResolver(editDocumentSchema),
    defaultValues: {
      title: '',
      userCode: '',
      description: '',
      version: '',
      date: '',
      status: 'Aktualna',
      type: 'Standardowe Procedury Operacyjne',
      color: '#3B82F6',
      googleDocsUrl: '',
    },
  });

  // Wypełnij formularz danymi dokumentu gdy się załaduje
  useEffect(() => {
    if (document) {
      form.reset({
        title: document.title,
        userCode: document.userCode || '',
        description: document.description,
        version: document.version,
        date: document.date,
        status: document.status,
        type: document.type,
        color: document.color || '#3B82F6',
        googleDocsUrl: document.googleDocsUrl || '',
      });
    }
  }, [document, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: EditDocumentData) => {
      if (!documentId) throw new Error('Brak ID dokumentu');
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Nie udało się zaktualizować dokumentu');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sukces",
        description: "Dokument został zaktualizowany",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      queryClient.invalidateQueries({ queryKey: ['/api/documents', documentId] });
      navigate('/admin');
    },
    onError: (error) => {
      toast({
        title: "Błąd",
        description: `Nie udało się zaktualizować dokumentu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditDocumentData) => {
    updateMutation.mutate(data);
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  if (!documentId) {
    return (
      <div className="min-h-screen bg-[hsl(210,40%,98%)]">
        <Header />
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Błąd</h1>
            <p className="text-gray-600 mb-4">Nieprawidłowy ID dokumentu</p>
            <Button onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót do panelu admin
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(210,40%,98%)]">
        <Header />
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[hsl(217,91%,60%)] mx-auto mb-4"></div>
            <p className="text-[hsl(215,25%,27%)]">Ładowanie dokumentu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-[hsl(210,40%,98%)]">
        <Header />
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Błąd</h1>
            <p className="text-gray-600 mb-4">Nie udało się załadować dokumentu</p>
            <Button onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót do panelu admin
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const colorOptions = [
    { value: '#3B82F6', label: 'Niebieski', color: 'bg-blue-500' },
    { value: '#10B981', label: 'Zielony', color: 'bg-green-500' },
    { value: '#F59E0B', label: 'Żółty', color: 'bg-yellow-500' },
    { value: '#EF4444', label: 'Czerwony', color: 'bg-red-500' },
    { value: '#8B5CF6', label: 'Fioletowy', color: 'bg-purple-500' },
    { value: '#06B6D4', label: 'Cyjan', color: 'bg-cyan-500' },
    { value: '#84CC16', label: 'Limonka', color: 'bg-lime-500' },
    { value: '#F97316', label: 'Pomarańczowy', color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-[hsl(210,40%,98%)]">
      <Header />
      
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Powrót do panelu admin
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[hsl(222,84%,5%)]">Edytuj dokument</h1>
            <p className="text-[hsl(215,25%,27%)] mt-1">
              Edytuj szczegóły dokumentu: {document.title}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Szczegóły dokumentu</CardTitle>
            <CardDescription>
              Kod systemu: <span className="font-mono text-gray-500">{document.code}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tytuł dokumentu *</FormLabel>
                      <FormControl>
                        <Input placeholder="Wprowadź tytuł dokumentu..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kod użytkownika</FormLabel>
                      <FormControl>
                        <Input placeholder="Twój własny kod dokumentu (opcjonalny)" {...field} />
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
                      <FormLabel>Opis *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Opisz cel i zawartość dokumentu..." 
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="version"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wersja *</FormLabel>
                        <FormControl>
                          <Input placeholder="np. 1.0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data *</FormLabel>
                        <FormControl>
                          <Input placeholder="np. 2025-01-30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Typ dokumentu *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wybierz typ dokumentu" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Standardowe Procedury Operacyjne">
                              Standardowe Procedury Operacyjne
                            </SelectItem>
                            <SelectItem value="Protokoły Badania">
                              Protokoły Badania
                            </SelectItem>
                            <SelectItem value="Formularze CRF">
                              Formularze CRF
                            </SelectItem>
                            <SelectItem value="Dokumenty Regulacyjne">
                              Dokumenty Regulacyjne
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wybierz status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Aktualna">Aktualna</SelectItem>
                            <SelectItem value="Archiwalna">Archiwalna</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kolor *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Wybierz kolor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {colorOptions.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded ${color.color}`} />
                                {color.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="googleDocsUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Google Docs</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://docs.google.com/document/d/..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-6">
                  <Button 
                    type="submit" 
                    disabled={updateMutation.isPending}
                    className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,50%)]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {updateMutation.isPending ? 'Zapisywanie...' : 'Zapisz zmiany'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleCancel}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Anuluj
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}