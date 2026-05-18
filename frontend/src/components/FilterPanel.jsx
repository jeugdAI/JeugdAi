import React from "react";

function FilterPanel({
  filters,
  onFilterChange,
  steden,
  specialisaties,
}) {
  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      stad: "",
      specialisatie: "",
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
          onChange={(e) =>
            handleInputChange("search", e.target.value)
          }
          className="filter-input"
        />
      </div>

      {/* STAD */}
      <div className="filter-group">
        <label htmlFor="stad">Stad</label>
        <select
          id="stad"
          value={filters.stad || ""}
          onChange={(e) =>
            handleInputChange("stad", e.target.value)
          }
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

      {/* SPECIALISATIES */}
      <div className="filter-group">
        <label htmlFor="specialisatie">Specialisatie</label>
        <select
          id="specialisatie"
          value={filters.specialisatie || ""}
          onChange={(e) =>
            handleInputChange("specialisatie", e.target.value)
          }
          className="filter-select"
        >
          <option value="">Alle specialisaties</option>

          {(specialisaties || []).map((spec, index) => (
            <option key={index} value={spec}>
              {spec.charAt(0).toUpperCase() + spec.slice(1)}
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