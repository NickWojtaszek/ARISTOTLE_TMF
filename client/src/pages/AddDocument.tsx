import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { insertDocumentSchema, type InsertDocument, type DocumentType } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { ArrowLeft, Plus } from "lucide-react";

export default function AddDocument() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addGoogleDocsNow, setAddGoogleDocsNow] = useState(false);

  const form = useForm<InsertDocument>({
    resolver: zodResolver(insertDocumentSchema),
    defaultValues: {
      title: "",
      code: "",
      userCode: "",
      description: "",
      version: "v.1.0",
      date: new Date().toLocaleDateString('pl-PL'),
      status: "Aktualna",
      type: "SOP",
      color: "#3B82F6",
      googleDocsUrl: "",
    },
  });

  const { data: documentTypes = [], isLoading: typesLoading } = useQuery<DocumentType[]>({
    queryKey: ['/api/document-types'],
  });

  const createDocumentMutation = useMutation({
    mutationFn: async (data: InsertDocument) => {
      // If not adding Google Docs now, clear the URL
      if (!addGoogleDocsNow) {
        data.googleDocsUrl = "";
      }
      return await apiRequest("POST", "/api/documents", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      toast({
        title: "Sukces",
        description: "Dokument został pomyślnie dodany",
      });
      form.reset();
    },
    onError: (error) => {
      console.error("Error creating document:", error);
      let errorMessage = "Nie udało się dodać dokumentu";
      
      // Check if it's a duplicate code error
      if (error && typeof error === 'object' && 'message' in error) {
        const errorStr = String(error.message);
        if (errorStr.includes("Document code already exists") || 
            errorStr.includes("already exists") ||
            errorStr.includes("duplicate key") ||
            errorStr.includes("documents_code_unique")) {
          errorMessage = "Kod dokumentu już istnieje. Proszę wybrać inny kod lub pozostawić pole puste.";
        }
      }
      
      toast({
        title: "Błąd",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertDocument) => {
    setIsSubmitting(true);
    try {
      await createDocumentMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(213,27%,84%)] to-[hsl(221,39%,98%)]">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót do głównej
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-[hsl(215,25%,27%)] mb-2">
            Dodaj Nowy Dokument
          </h1>
          <p className="text-[hsl(215,25%,47%)]">
            Dodaj dokument do ARISTOTLE Trial Master File (TMF)
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Formularz dodawania dokumentu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tytuł dokumentu *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Wprowadź tytuł dokumentu" 
                            {...field} 
                          />
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
                        <FormLabel className="text-gray-500">Kod Systemu (automatyczny)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Generowany automatycznie" 
                            {...field} 
                            className="bg-gray-50 text-gray-500"
                            disabled
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-gray-400">
                          Kod techniczny generowany automatycznie przez system
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="userCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">Twój Kod Dokumentu</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="np. TMF-SOP-001, PROT-v2.1, itp." 
                            {...field} 
                            className="border-blue-200 focus:border-blue-400"
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-gray-500">
                          Opcjonalny kod według Twojego systemu numerowania
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="version"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Wersja *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="np. v.1.0" 
                            {...field} 
                          />
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
                          <Input 
                            placeholder="np. 30.07.2025" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Typ dokumentu *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Wybierz typ dokumentu" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {documentTypes.map((type) => (
                              <SelectItem key={type.id} value={type.displayName}>
                                {type.displayName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                      <FormLabel>Opis dokumentu *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Wprowadź szczegółowy opis dokumentu"
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="add-google-docs" 
                      checked={addGoogleDocsNow}
                      onCheckedChange={(checked) => setAddGoogleDocsNow(checked === true)}
                    />
                    <label 
                      htmlFor="add-google-docs" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Dodaj link do Google Docs teraz
                    </label>
                  </div>
                  
                  {addGoogleDocsNow && (
                    <FormField
                      control={form.control}
                      name="googleDocsUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Link do Google Docs *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://docs.google.com/document/d/..." 
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {!addGoogleDocsNow && (
                    <p className="text-sm text-muted-foreground">
                      Link do Google Docs można dodać później w panelu administracyjnym
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
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
                        <FormLabel>Kolor dokumentu *</FormLabel>
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

                <div className="flex gap-4 pt-6">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || typesLoading}
                    className="bg-[hsl(217,91%,60%)] hover:bg-[hsl(217,91%,50%)]"
                  >
                    {isSubmitting ? "Dodawanie..." : "Dodaj dokument"}
                  </Button>
                  <Link href="/">
                    <Button type="button" variant="outline">
                      Anuluj
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}