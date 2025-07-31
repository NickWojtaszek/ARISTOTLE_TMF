import { Link, useLocation } from "wouter";
import { Settings } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  
  return (
    <header className="bg-gradient-to-br from-[hsl(217,91%,36%)] to-[hsl(213,94%,68%)] text-white py-8 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="text-center lg:text-left">
            <Link href="/">
              <h1 className="text-3xl lg:text-4xl font-bold mb-2 cursor-pointer hover:opacity-90 transition-opacity">
                ARISTOTLE Trial Master File (TMF)
              </h1>
            </Link>
            <p className="text-lg opacity-90">
              Repozytorium Dokumentów Klinicznych i Standardowych Procedur Operacyjnych
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center lg:text-right text-sm opacity-90">
              <div className="mb-2">Protokół v.1.6 (24.07.2025)</div>
              <div className="mb-3">EudraCT: 2024-518657-42-00</div>
              <div className="inline-block bg-white bg-opacity-20 border border-white border-opacity-30 px-4 py-2 rounded-full">
                <svg className="inline w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Badanie aktywne
              </div>
            </div>
            
            <Link href="/admin">
              <div className={`p-3 rounded-lg transition-all cursor-pointer ${
                location === '/admin' 
                  ? 'bg-white bg-opacity-20 border border-white border-opacity-30' 
                  : 'hover:bg-white hover:bg-opacity-10'
              }`}>
                <Settings className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
