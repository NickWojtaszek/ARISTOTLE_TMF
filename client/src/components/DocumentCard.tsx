import { Document } from '@/types/document';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface DocumentCardProps {
  document: Document;
  viewMode?: 'grid' | 'list';
  onEditClick?: (documentId: number) => void;
}

export default function DocumentCard({ document, viewMode = 'grid', onEditClick }: DocumentCardProps) {
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  
  // PIN do edycji dokumentów - można to późnej przechowywać w zmiennych środowiskowych
  const EDIT_PIN = '1234';
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'SOP':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6h-3a1 1 0 100 2h3v3a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm1 3a1 1 0 100 2h4a1 1 0 100-2H8z" />
          </svg>
        );
      case 'Protokół':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 7a1 1 0 011-1h12a1 1 0 011 1v6h-2V9a1 1 0 00-1-1H6a1 1 0 00-1 1v4H3V7z" clipRule="evenodd" />
          </svg>
        );
      case 'CRF':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
        );
      case 'Regulatory':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const convertToPdfUrl = (googleDocsUrl: string) => {
    // Konwersja URL Google Docs do formatu PDF z dodatkowym parametrem
    // Z: https://docs.google.com/document/d/DOCUMENT_ID/edit
    // Na: https://docs.google.com/document/d/DOCUMENT_ID/export?format=pdf&portrait=true&size=a4
    if (googleDocsUrl.includes('/edit')) {
      return googleDocsUrl.replace('/edit', '/export?format=pdf&portrait=true&size=a4&fitw=true');
    }
    // Alternatywnie, używamy preview zamiast export
    const documentId = googleDocsUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (documentId) {
      return `https://docs.google.com/document/d/${documentId[1]}/export?format=pdf&portrait=true&size=a4&fitw=true`;
    }
    return googleDocsUrl + '/export?format=pdf&portrait=true&size=a4&fitw=true';
  };

  const getPreviewUrl = (googleDocsUrl: string) => {
    // Alternatywna metoda - podgląd bez pobierania
    const documentId = googleDocsUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (documentId) {
      return `https://docs.google.com/document/d/${documentId[1]}/preview`;
    }
    return googleDocsUrl.replace('/edit', '/preview');
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Edit button clicked, opening PIN dialog. ViewMode:', viewMode);
    console.log('Dialog state before:', isPinDialogOpen);
    setIsPinDialogOpen(true);
    console.log('Dialog state after setting to true');
  };

  const handlePinSubmit = () => {
    console.log('PIN submitted:', pin, 'Expected:', EDIT_PIN);
    if (pin === EDIT_PIN) {
      console.log('PIN correct, opening Google Docs:', document.googleDocsUrl);
      setIsPinDialogOpen(false);
      setPin('');
      setPinError('');
      if (document.googleDocsUrl) {
        window.open(document.googleDocsUrl, '_blank');
      } else {
        alert('URL Google Docs nie jest dostępny dla tego dokumentu');
      }
    } else {
      console.log('PIN incorrect');
      setPinError('Nieprawidłowy PIN');
    }
  };

  const handlePinCancel = () => {
    setIsPinDialogOpen(false);
    setPin('');
    setPinError('');
  };

  const handlePdfClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (document.googleDocsUrl) {
      // Używamy preview URL - bardziej niezawodne niż bezpośredni export
      const previewUrl = getPreviewUrl(document.googleDocsUrl);
      window.open(previewUrl, '_blank');
    } else {
      alert('URL Google Docs nie jest dostępny dla tego dokumentu');
    }
  };

  const handlePdfDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (document.googleDocsUrl) {
      // Próba bezpośredniego pobrania PDF
      const pdfUrl = convertToPdfUrl(document.googleDocsUrl);
      window.open(pdfUrl, '_blank');
    } else {
      alert('URL Google Docs nie jest dostępny dla tego dokumentu');
    }
  };

  const listView = (
    <div 
      className="bg-white border-l-4 rounded-lg p-3 transition-all duration-300 hover:shadow-md shadow-sm"
      style={{ borderLeftColor: document.color || '#3B82F6' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: document.color || '#3B82F6' }}
          >
            {getDocumentIcon(document.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2">
              <h3 className="text-base font-semibold text-[hsl(222,84%,5%)] flex-1 line-clamp-2 leading-tight">
                {document.title}
              </h3>
              {(!document.googleDocsUrl || document.googleDocsUrl.trim() === '') && (
                <div 
                  className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5"
                  title="Brak linku do Google Docs"
                >
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-[hsl(215,25%,52%)]">
              <span className="font-mono text-xs text-gray-400">{document.code}</span>
              {document.userCode && <span className="font-mono text-[hsl(217,91%,60%)]">{document.userCode}</span>}
              <span>Wersja: {document.version}</span>
              <span>{document.date}</span>
            </div>
          </div>
          <div className="hidden lg:block flex-1 min-w-0 max-w-lg">
            <p className="text-sm text-[hsl(215,25%,27%)] line-clamp-2 leading-tight">
              {document.description}
            </p>
          </div>
        </div>
        <div className="flex gap-1 ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onEditClick) {
                onEditClick(document.id);
              } else {
                window.open(`/documents/edit/${document.id}`, '_blank');
              }
            }}
            className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            title="Edytuj wpis"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={handleEditClick}
            className="w-7 h-7 flex items-center justify-center bg-[hsl(217,91%,60%)] text-white rounded-lg hover:bg-[hsl(217,91%,50%)] transition-colors"
            title="Edytuj dokument w Google Docs"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              <path d="M8 8a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M8 12a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            </svg>
          </button>
          <button
            onClick={handlePdfClick}
            className="w-7 h-7 flex items-center justify-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            title="Podgląd dokumentu"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const gridView = (
    <div 
      className="bg-white border-2 rounded-lg p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 shadow-sm group"
      style={{ 
        borderColor: document.color || '#3B82F6',
        '--hover-border-color': document.color || '#3B82F6'
      } as React.CSSProperties}
    >
      <div className="flex items-start gap-2 mb-4">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: document.color || '#3B82F6' }}
        >
          {getDocumentIcon(document.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            <h3 className="text-base font-semibold text-[hsl(222,84%,5%)] line-clamp-2 flex-1 leading-tight">
              {document.title}
            </h3>
            {(!document.googleDocsUrl || document.googleDocsUrl.trim() === '') && (
              <div 
                className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5"
                title="Brak linku do Google Docs"
              >
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-block font-mono text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded font-medium">
              {document.code}
            </div>
            {document.userCode && (
              <div className="inline-block font-mono text-xs text-[hsl(217,91%,60%)] bg-blue-50 px-2 py-1 rounded font-medium">
                {document.userCode}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <p className="text-[hsl(215,25%,27%)] text-sm mb-4 line-clamp-2 leading-tight">
        {document.description}
      </p>
      
      <div className="flex justify-between items-center text-xs text-[hsl(215,25%,52%)] mb-4 pt-3 border-t border-gray-100">
        <span>Wersja: {document.version}</span>
        <span>{document.date}</span>
      </div>
      
      <div className="flex gap-1 pt-2 justify-center">
        <button
          onClick={(e) => {
            e.stopPropagation();
            // TODO: Dodaj funkcję edycji wpisu (otwórz formularz edycji)
            alert('Edycja wpisu - funkcja w przygotowaniu');
          }}
          className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          title="Edytuj wpis"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          onClick={handleEditClick}
          className="w-7 h-7 flex items-center justify-center bg-[hsl(217,91%,60%)] text-white rounded-lg hover:bg-[hsl(217,91%,50%)] transition-colors"
          title="Edytuj dokument w Google Docs"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
            <path d="M8 8a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M8 12a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
          </svg>
        </button>
        <button
          onClick={handlePdfClick}
          className="w-7 h-7 flex items-center justify-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          title="Podgląd dokumentu"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {viewMode === 'list' ? listView : gridView}
      
      <Dialog open={isPinDialogOpen} onOpenChange={setIsPinDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Autoryzacja edycji dokumentu</DialogTitle>
            <DialogDescription>
              Wprowadź PIN aby uzyskać dostęp do edycji dokumentu
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Wprowadź PIN"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setPinError('');
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handlePinSubmit();
                  }
                }}
                className={pinError ? 'border-red-500' : ''}
              />
              {pinError && (
                <p className="text-sm text-red-500 mt-1">{pinError}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePinSubmit} className="flex-1">
                Potwierdź
              </Button>
              <Button onClick={handlePinCancel} variant="outline" className="flex-1">
                Anuluj
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
