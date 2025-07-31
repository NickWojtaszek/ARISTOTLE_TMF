export default function Footer() {
  return (
    <footer className="bg-[hsl(222,84%,5%)] text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
            <p className="text-sm opacity-80 mb-2">Centrum Badań Klinicznych</p>
            <p className="text-sm opacity-80 mb-2">Tel: +48 22 123 45 67</p>
            <p className="text-sm opacity-80">Email: aristotle@clinic.pl</p>
          </div>
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">ARISTOTLE Trial Master File</h4>
            <p className="text-sm opacity-80 mb-2">Faza III badania klinicznego</p>
            <p className="text-sm opacity-80 mb-2">Wieloośrodkowe, randomizowane</p>
            <p className="text-sm opacity-80">Podwójnie zaślepione</p>
          </div>
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold mb-4">Informacje</h4>
            <p className="text-sm opacity-80 mb-2">Wersja systemu: 2.1.4</p>
            <p className="text-sm opacity-80 mb-2">Ostatnia aktualizacja: 24.01.2025</p>
            <p className="text-sm opacity-80">© 2025 Centrum Badań</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
