import { useState, useMemo } from "react";
import {
  zorgaanbiedersData,
  zorgTypes,
  steden,
  specialisaties,
} from "./data/zorgaanbieders";
import FilterPanel from "./components/FilterPanel";
import ZorgaanbiederTile from "./components/ZorgaanbiederTile";
import NAWModal from "./components/NAWModal";
import "./App.css";

function App() {
  const [filters, setFilters] = useState({
    type: "",
    stad: "",
    specialisatie: "",
    search: "",
  });
  const [selectedZorgaanbieder, setSelectedZorgaanbieder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredZorgaanbieders = useMemo(() => {
    return zorgaanbiedersData.filter((zorgaanbieder) => {
      const matchesType = !filters.type || zorgaanbieder.type === filters.type;
      const matchesStad = !filters.stad || zorgaanbieder.stad === filters.stad;
      const matchesSpecialisatie =
        !filters.specialisatie ||
        zorgaanbieder.specialisaties.includes(filters.specialisatie);
      const matchesSearch =
        !filters.search ||
        zorgaanbieder.naam.toLowerCase().includes(filters.search.toLowerCase());

      return (
        matchesType && matchesStad && matchesSpecialisatie && matchesSearch
      );
    });
  }, [filters]);

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
            zorgTypes={zorgTypes}
            steden={steden}
            specialisaties={specialisaties}
          />
        </aside>

        <main className="tiles-container">
          <div className="tiles-header">
            <h2>Zorgaanbieders ({filteredZorgaanbieders.length})</h2>
          </div>

          <div className="tiles-grid">
            {filteredZorgaanbieders.map((zorgaanbieder) => (
              <ZorgaanbiederTile
                key={zorgaanbieder.id}
                zorgaanbieder={zorgaanbieder}
                onClick={() => handleTileClick(zorgaanbieder)}
              />
            ))}
          </div>

          {filteredZorgaanbieders.length === 0 && (
            <div className="no-results">
              <p>Geen zorgaanbieders gevonden met de geselecteerde filters.</p>
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
