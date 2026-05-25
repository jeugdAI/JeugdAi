import React from "react";

function FilterPanel({ filters, onFilterChange, steden, behandelingen }) {
  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      stad: "",
      behandeling: "",
      search: "",
    });
  };

  return (
    <div className="filter-panel">
      {/* HEADER */}
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="clear-filters-btn" onClick={clearFilters}>
          Wis filters
        </button>
      </div>

      {/* SEARCH */}
      <div className="filter-group">
        <label htmlFor="search">Zoeken</label>
        <input
          type="text"
          id="search"
          placeholder="Naam van zorgaanbieder..."
          value={filters.search || ""}
          onChange={(e) => handleInputChange("search", e.target.value)}
          className="filter-input"
        />
      </div>

      {/* STAD */}
      <div className="filter-group">
        <label htmlFor="stad">Stad</label>
        <select
          id="stad"
          value={filters.stad || ""}
          onChange={(e) => handleInputChange("stad", e.target.value)}
          className="filter-select"
        >
          <option value="">Alle steden</option>

          {(steden || []).map((stad, index) => (
            <option key={index} value={stad}>
              {stad}
            </option>
          ))}
        </select>
      </div>

      {/* BEHANDELINGEN */}
      <div className="filter-group">
        <label htmlFor="behandeling">Behandeling</label>
        <select
          id="behandeling"
          value={filters.behandeling || ""}
          onChange={(e) => handleInputChange("behandeling", e.target.value)}
          className="filter-select"
        >
          <option value="">Alle behandelingen</option>

          {(behandelingen || []).map((behandeling, index) => (
            <option key={index} value={behandeling}>
              {behandeling.charAt(0).toUpperCase() + behandeling.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* SUMMARY */}
      <div className="filter-summary">
        <p className="filter-count">
          {Object.values(filters).filter((v) => v !== "").length} filters actief
        </p>
      </div>
    </div>
  );
}

export default FilterPanel;
