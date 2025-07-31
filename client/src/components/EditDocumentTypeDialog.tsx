import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { DocumentType } from '@shared/schema';

// Schema do edycji typu dokumentu
const editDocumentTypeSchema = z.object({
  name: z.string().min(1, 'Nazwa jest wymagana'),
  displayName: z.string().min(1, 'Nazwa wyświetlana jest wymagana'),
  description: z.string().optional(),
});

type EditDocumentTypeData = z.infer<typeof editDocumentTypeSchema>;

interface EditDocumentTypeDialogProps {
  documentTypeId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditDocumentTypeDialog({ documentTypeId, isOpen, onClose }: EditDocumentTypeDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documentType, isLoading } = useQuery<DocumentType>({
    queryKey: ['/api/document-types', documentTypeId],
    queryFn: async () => {
      if (!documentTypeId) throw new Error('Brak ID typu dokumentu');
      const response = await fetch(`/api/document-types/${documentTypeId}`);
      if (!response.ok) throw new Error('Nie udało się pobrać typu dokumentu');
      return response.json();
    },
    enabled: !!documentTypeId && isOpen,
  });

  const form = useForm<EditDocumentTypeData>({
    resolver: zodResolver(editDocumentTypeSchema),
    defaultValues: {
      name: '',
      displayName: '',
      description: '',
    },
  });

  // Wypełnij formularz danymi typu dokumentu gdy się załaduje
  useEffect(() => {
    if (documentType) {
      form.reset({
        name: documentType.name,
        displayName: documentType.displayName,
        description: documentType.description || '',
      });
    }
  }, [documentType, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: EditDocumentTypeData) => {
      if (!documentTypeId) throw new Error('Brak ID typu dokumentu');
      const response = await fetch(`/api/document-types/${documentTypeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Nie udało się zaktualizować typu dokumentu');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sukces",
        description: "Typ dokumentu został zaktualizowany",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/document-types'] });
      queryClient.invalidateQueries({ queryKey: ['/api/document-types', documentTypeId] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Błąd",
        description: `Nie udało się zaktualizować typu dokumentu: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EditDocumentTypeData) => {
    updateMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edytuj typ dokumentu</DialogTitle>
          <DialogDescription>
            {documentType && (
              <>
                Edytuj szczegóły typu dokumentu: {documentType.displayName}
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(217,91%,60%)]"></div>
            <span className="ml-2">Ładowanie...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nazwa techniczna *</FormLabel>
                    <FormControl>
                      <Input placeholder="np. SOP, PROTOCOL" {...field} />
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
                      <Textarea 
                        placeholder="Opis typu dokumentu..." 
                        {...field}
                        value={field.value || ''}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
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
                  onClick={handleClose}
                >
                  <X className="w-4 h-4 mr-2" />
                  Anuluj
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}