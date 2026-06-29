import { useState, useEffect, useMemo } from "react";
import FilterPanel from "./components/FilterPanel";
import ZorgaanbiederTile from "./components/ZorgaanbiederTile";
import NAWModal from "./components/NAWModal";
import AddNoteModal from "./components/AddNoteModal";
import EditWachtrijModal from "./components/EditWachtrijModal";
import "./App.css";
import Logo_big from "/Logo_big.png";

function App() {
  // STATE
  const [filters, setFilters] = useState({
    stad: "",
    problematiek: "",
    product: "",
    search: "",
    regio_indeling: [],
  });

  const [allZorgaanbieders, setAllZorgaanbieders] = useState([]);
  const [zorgaanbieders, setZorgaanbieders] = useState([]);
  const [problematieken, setProblematieken] = useState([]);
  const [producten, setProducten] = useState([]);

  const [selectedZorgaanbieder, setSelectedZorgaanbieder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isWachtrijModalOpen, setIsWachtrijModalOpen] = useState(false);
  // ---------------------------------------
  // Alle DATA (NO FILTERING)
  // ---------------------------------------
  useEffect(() => {
    fetch("http://localhost:8000/api/zorgaanbieders/")
      .then((res) => res.json())
      .then((data) => setAllZorgaanbieders(data))
      .catch((err) => console.error("Master data error:", err));
  }, []);

  // ---------------------------------------
  // API CALL (WITH BACKEND FILTERING)
  // ---------------------------------------
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.regio_indeling)      filters.regio_indeling.forEach((r) =>
        params.append("regio_indeling", r),
      );
    if (filters.stad) params.append("stad", filters.stad);
    if (filters.search) params.append("search", filters.search);
    if (filters.problematiek)
      params.append("problematiek", filters.problematiek);
    if (filters.product)
      params.append("product", filters.product);

    fetch(`http://localhost:8000/api/zorgaanbieders/?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setZorgaanbieders(data))
      .catch((err) => console.error("Zorgaanbieders error:", err));
  }, [filters]);

  // ---------------------------------------
  // PRODUCTS API
  // ---------------------------------------
  useEffect(() => {
    fetch("http://localhost:8000/api/producten/")
      .then((res) => res.json())
      .then((data) => setProducten(data))
      .catch((err) => console.error("Producten error:", err));
  }, []);
  // ---------------------------------------
  // DERIVED DATA (NO FILTERING HERE!)
  // ---------------------------------------
  const steden = useMemo(() => {
    return [...new Set(allZorgaanbieders.map((z) => z.city))].sort();
  }, [allZorgaanbieders]);

  const problematiekOptions = useMemo(() => {
    return [
      ...new Set(
        allZorgaanbieders.flatMap((z) =>
          (z.problematieken || []).map((p) => p.name),
        ),
      ),
    ].sort();
  }, [allZorgaanbieders]);

  const productOptions = useMemo(() => {
    return [
      ...new Set(
        allZorgaanbieders.flatMap((z) =>
          (z.producten || []).map((p) => p.name),
        ),
      ),
    ].sort();
  }, [allZorgaanbieders]);

  // ---------------------------------------
  // HANDLERS
  // ---------------------------------------
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleTileClick = (zorgaanbieder) => {
    setSelectedZorgaanbieder(zorgaanbieder);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedZorgaanbieder(null);
  };
  const handleAddNoteClick = (zorgaanbieder) => {
    console.log("Functie start voor:", zorgaanbieder.name);
    setSelectedZorgaanbieder(zorgaanbieder);
    setIsNoteModalOpen(true);
  };

  const handleCloseNoteModal = () => {
    setIsNoteModalOpen(false);
    setSelectedZorgaanbieder(null);
  };
  const handleSaveNote = (providerId, newNote) => {
    const updateNotesList = (list) =>
      list.map((z) => (z.id === providerId ? { ...z, notes: [...(z.notes || []), newNote] } : z));

    setZorgaanbieders((prev) => updateNotesList(prev));
    setAllZorgaanbieders((prev) => updateNotesList(prev));
  };
  const handleEditWachtrijClick = (zorgaanbieder) => {
    setSelectedZorgaanbieder(zorgaanbieder);
    setIsWachtrijModalOpen(true);
  };

  const handleCloseWachtrijModal = () => {
    setIsWachtrijModalOpen(false);
    setSelectedZorgaanbieder(null);
  };

  const handleSaveWachtrij = (updatedZorgaanbieder) => {
    // Deze functie vervangt de oude zorgaanbieder data door de nieuwe (met geüpdatete wachtrij)
    const updateList = (list) =>
      list.map((z) => (z.id === updatedZorgaanbieder.id ? updatedZorgaanbieder : z));

    setZorgaanbieders((prev) => updateList(prev));
    setAllZorgaanbieders((prev) => updateList(prev));
  };

  // ---------------------------------------
  // UI
  // ---------------------------------------
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <img src={Logo_big} alt="Logo CJG" />
        <div className="header-text">
          <h1>Zorgaanbieders Dashboard</h1>
          <p>Vind en beheer zorgaanbieders in de regio</p>
        </div>
          <div className="header-spacer"></div>
      </header>

      <div className="dashboard-content">
        <aside className="filter-sidebar">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            steden={steden}
            problematieken={problematiekOptions}
            producten={productOptions}
          />
        </aside>

        <main className="tiles-container">
          <div className="tiles-header">
            <h2>Zorgaanbieders ({zorgaanbieders.length})</h2>
          </div>

          <div className="tiles-grid">
            {zorgaanbieders.map((zorgaanbieder) => (
              <ZorgaanbiederTile
                key={zorgaanbieder.id}
                zorgaanbieder={zorgaanbieder}
                onDetailsClick={() => handleTileClick(zorgaanbieder)}
                onAddNoteClick={() => handleAddNoteClick(zorgaanbieder)}
                onEditWachtrijClick={() => handleEditWachtrijClick(zorgaanbieder)}
              />
            ))}
          </div>

          {zorgaanbieders.length === 0 && (
            <div className="no-results">
              <p>Geen zorgaanbieders gevonden.</p>
            </div>
          )}
        </main>
      </div>

      {isModalOpen && selectedZorgaanbieder && (
        <NAWModal
          zorgaanbieder={selectedZorgaanbieder}
          onClose={handleCloseModal}
        />
      )}
      {isNoteModalOpen && selectedZorgaanbieder && (
        <AddNoteModal
          zorgaanbieder={selectedZorgaanbieder}
          onClose={handleCloseNoteModal}
          onSave={handleSaveNote}
        />
      )}
      {isWachtrijModalOpen && selectedZorgaanbieder && (
        <EditWachtrijModal
          zorgaanbieder={selectedZorgaanbieder}
          onClose={handleCloseWachtrijModal}
          onSave={handleSaveWachtrij}
        />
      )}
    </div>
  );
}

export default App;