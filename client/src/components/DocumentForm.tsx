import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Document } from '@/types/document';

const documentSchema = z.object({
  title: z.string().min(1, 'Tytuł jest wymagany'),
  code: z.string().min(1, 'Kod jest wymagany'),
  description: z.string().min(1, 'Opis jest wymagany'),
  version: z.string().min(1, 'Wersja jest wymagana'),
  date: z.string().min(1, 'Data jest wymagana'),
  status: z.enum(['Aktualna', 'Archiwalna']),
  category: z.enum(['sop', 'protocol', 'form', 'regulatory']),
  type: z.enum(['SOP', 'Protokół', 'CRF', 'Regulatory']),
  color: z.string().min(1, 'Kolor jest wymagany'),
  googleDocsUrl: z.string().url('Podaj prawidłowy URL Google Docs').min(1, 'URL Google Docs jest wymagany'),
});

type DocumentFormData = z.infer<typeof documentSchema>;

interface DocumentFormProps {
  document?: Document;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function DocumentForm({ document, onSuccess, onCancel }: DocumentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: document ? {
      title: document.title,
      code: document.code,
      description: document.description,
      version: document.version,
      date: document.date,
      status: document.status,
      category: document.category,
      type: document.type,
      color: document.color || '#3B82F6',
      googleDocsUrl: document.googleDocsUrl || '',
    } : {
      status: 'Aktualna',
      category: 'sop',
      type: 'SOP',
      date: new Date().toLocaleDateString('pl-PL'),
      version: 'v.1.0',
      color: '#3B82F6',
      googleDocsUrl: '',
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: DocumentFormData) => {
      return apiRequest('POST', '/api/documents', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      toast({
        title: 'Sukces',
        description: 'Dokument został utworzony pomyślnie',
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Błąd',
        description: error.message || 'Nie udało się utworzyć dokumentu',
        variant: 'destructive',
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: DocumentFormData) => {
      console.log('Updating document:', document!.id, 'with data:', data);
      return apiRequest('PATCH', `/api/documents/${document!.id}`, data);
    },
    onSuccess: (result) => {
      console.log('Update successful:', result);
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      toast({
        title: 'Sukces',
        description: 'Dokument został zaktualizowany pomyślnie',
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      console.error('Update failed:', error);
      toast({
        title: 'Błąd',
        description: error.message || 'Nie udało się zaktualizować dokumentu',
        variant: 'destructive',
      });
    }
  });

  const onSubmit = async (data: DocumentFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Is editing mode?', !!document);
    setIsSubmitting(true);
    try {
      if (document) {
        console.log('Calling update mutation for document:', document.id);
        await updateMutation.mutateAsync(data);
      } else {
        console.log('Calling create mutation');
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tytuł</FormLabel>
                <FormControl>
                  <Input placeholder="Wprowadź tytuł dokumentu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kod</FormLabel>
                <FormControl>
                  <Input placeholder="Wprowadź kod dokumentu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opis</FormLabel>
              <FormControl>
                <Textarea placeholder="Wprowadź opis dokumentu" rows={4} {...field} />
              </FormControl>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wersja</FormLabel>
                <FormControl>
                  <Input placeholder="v.1.0" {...field} />
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
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input placeholder="DD.MM.YYYY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kolor</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    {[
                      { name: 'Niebieski', value: '#3B82F6' },
                      { name: 'Zielony', value: '#10B981' },
                      { name: 'Czerwony', value: '#EF4444' },
                      { name: 'Żółty', value: '#F59E0B' },
                      { name: 'Fioletowy', value: '#8B5CF6' },
                      { name: 'Różowy', value: '#EC4899' },
                      { name: 'Pomarańczowy', value: '#F97316' },
                      { name: 'Szary', value: '#6B7280' }
                    ].map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => field.onChange(color.value)}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          field.value === color.value 
                            ? 'border-gray-800 ring-2 ring-gray-300' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz kategorię" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sop">SOP</SelectItem>
                    <SelectItem value="protocol">Protokół</SelectItem>
                    <SelectItem value="form">Formularz</SelectItem>
                    <SelectItem value="regulatory">Regulacyjny</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Typ</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz typ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SOP">SOP</SelectItem>
                    <SelectItem value="Protokół">Protokół</SelectItem>
                    <SelectItem value="CRF">CRF</SelectItem>
                    <SelectItem value="Regulatory">Regulatory</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Zapisywanie...' : (document ? 'Aktualizuj' : 'Utwórz')}
          </Button>
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="flex-1"
            >
              Anuluj
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}