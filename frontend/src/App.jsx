import { useState, useEffect, useMemo } from "react";
import FilterPanel from "./components/FilterPanel";
import ZorgaanbiederTile from "./components/ZorgaanbiederTile";
import NAWModal from "./components/NAWModal";
import "./App.css";

function App() {
  // STATE
  const [filters, setFilters] = useState({
    stad: "",
    specialisatie: "",
    search: "",
  });

  const [zorgaanbieders, setZorgaanbieders] = useState([]);
  const [specialisaties, setSpecialisaties] = useState([]);

  const [selectedZorgaanbieder, setSelectedZorgaanbieder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ---------------------------------------
  // API CALL (WITH BACKEND FILTERING)
  // ---------------------------------------
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.stad) params.append("stad", filters.stad);
    if (filters.search) params.append("search", filters.search);
    if (filters.specialisatie)
      params.append("specialisatie", filters.specialisatie);

    fetch(`http://localhost:8000/api/zorgaanbieders/?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setZorgaanbieders(data))
      .catch((err) => console.error("Zorgaanbieders error:", err));
  }, [filters]);

  // useEffect(() => {
  //   fetch("http://localhost:8000/api/specialisaties/")
  //     .then((res) => res.json())
  //     .then((data) => setSpecialisaties(data))
  //     .catch((err) => console.error("Specialisaties error:", err));
  // }, []);

  // ---------------------------------------
  // DERIVED DATA (NO FILTERING HERE!)
  // ---------------------------------------
  const steden = useMemo(() => {
    return [...new Set(zorgaanbieders.map((z) => z.city))].sort();
  }, [zorgaanbieders]);

  const specialisatieOptions = useMemo(() => {
    return [
      ...new Set(
        zorgaanbieders.flatMap((z) =>
          (z.specialisaties || []).map((s) => s.name),
        ),
      ),
    ].sort();
  }, [zorgaanbieders]);

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

  // ---------------------------------------
  // UI
  // ---------------------------------------
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Zorgaanbieders Dashboard</h1>
        <p>Vind en beheer zorgaanbieders in de regio</p>
      </header>

      <div className="dashboard-content">
        <aside className="filter-sidebar">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            steden={steden}
            specialisaties={specialisatieOptions}
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
                onClick={() => handleTileClick(zorgaanbieder)}
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
    </div>
  );
}

export default App;
