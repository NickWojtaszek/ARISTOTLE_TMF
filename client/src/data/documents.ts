import { Document } from '@/types/document';

export const documents: Record<string, Document[]> = {
  sops: [
    {
      id: 1,
      title: 'Procedura Kwalifikacji i Włączania Pacjentów',
      code: 'SOP-ARISTOTLE-001',
      description: 'Szczegółowa procedura dotycząca kwalifikacji pacjentów do badania, weryfikacja kryteriów włączenia i wyłączenia.',
      version: 'v.2.1',
      date: '15.01.2025',
      status: 'Aktualna',
      category: 'sop',
      type: 'SOP'
    },
    {
      id: 2,
      title: 'Procedura Randomizacji i Kodowania',
      code: 'SOP-ARISTOTLE-002', 
      description: 'Procedura dotycząca procesu randomizacji pacjentów oraz systemu kodowania produktu badanego.',
      version: 'v.1.8',
      date: '10.01.2025',
      status: 'Aktualna',
      category: 'sop',
      type: 'SOP'
    },
    {
      id: 3,
      title: 'Monitoring Bezpieczeństwa i Zdarzeń Niepożądanych',
      code: 'SOP-ARISTOTLE-003',
      description: 'Procedura monitorowania, raportowania i zarządzania zdarzeniami niepożądanymi podczas badania.',
      version: 'v.3.0',
      date: '05.01.2025', 
      status: 'Aktualna',
      category: 'sop',
      type: 'SOP'
    },
    {
      id: 4,
      title: 'Zarządzanie Danymi i Dokumentacją',
      code: 'SOP-ARISTOTLE-004',
      description: 'Procedura dotycząca zbierania, wprowadzania, weryfikacji i archivizacji danych badania.',
      version: 'v.2.3',
      date: '20.12.2024',
      status: 'Aktualna',
      category: 'sop',
      type: 'SOP'
    },
    {
      id: 5,
      title: 'Kontrola Jakości i Audyty',
      code: 'SOP-ARISTOTLE-005',
      description: 'Procedura przeprowadzania kontroli jakości, audytów wewnętrznych i przygotowania do inspekcji.',
      version: 'v.1.5',
      date: '18.12.2024',
      status: 'Aktualna',
      category: 'sop',
      type: 'SOP'
    },
    {
      id: 6,
      title: 'Zakończenie Badania i Archivizacja',
      code: 'SOP-ARISTOTLE-006',
      description: 'Procedura dotycząca zakończenia badania, przygotowania raportu końcowego i długoterminowej archivizacji.',
      version: 'v.1.2',
      date: '15.12.2024',
      status: 'Aktualna',
      category: 'sop',
      type: 'SOP'
    }
  ],
  protocols: [
    {
      id: 7,
      title: 'Protokół Główny Badania ARISTOTLE',
      code: 'PROT-ARISTOTLE-MAIN',
      description: 'Główny protokół badania zawierający pełny opis celów, metodologii i procedur badawczych.',
      version: 'v.1.6',
      date: '24.07.2025',
      status: 'Aktualna',
      category: 'protocol',
      type: 'Protokół'
    }
  ],
  forms: [
    {
      id: 8,
      title: 'Formularz Danych Demograficznych',
      code: 'CRF-ARISTOTLE-DEMO',
      description: 'Case Report Form zawierający dane demograficzne i historię medyczną pacjenta.',
      version: 'v.2.0',
      date: '12.01.2025',
      status: 'Aktualna',
      category: 'form',
      type: 'CRF'
    }
  ],
  regulatory: [
    {
      id: 9,
      title: 'Zgoda Komisji Bioetycznej',
      code: 'REG-ARISTOTLE-EC',
      description: 'Pozytywna opinia Komisji Bioetycznej wraz z zatwierdzonymi dokumentami dla pacjentów.',
      version: 'v.1.0',
      date: '30.06.2024',
      status: 'Aktualna',
      category: 'regulatory',
      type: 'Regulatory'
    }
  ]
};
