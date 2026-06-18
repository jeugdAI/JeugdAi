import React from "react";

function FilterPanel({ filters, onFilterChange, steden, producten, problematieken }) {
  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      stad: "",
      problematiek: "",
      product: "",
      search: "",
      regio_indeling: ""
    });
  };
  console.table(filters);
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

            {/* PRODUCTEN */}
      <div className="filter-group">
        <label htmlFor="product">Product</label>
        <select
          id="product"
          value={filters.product || ""}
          onChange={(e) => handleInputChange("product", e.target.value)}
          className="filter-select"
        >
          <option value="">Alle producten</option>

          {(producten || []).map((product, index) => (
            <option key={index} value={product}>
              {product.charAt(0).toUpperCase() + product.slice(1)}
            </option>
          ))}
        </select>
      </div>

            {/* PROBLEMATIEKEN */}
      <div className="filter-group">
        <label htmlFor="problematiek">Problematiek</label>
        <select
          id="problematiek"
          value={filters.problematiek || ""}
          onChange={(e) => handleInputChange("problematiek", e.target.value)}
          className="filter-select"
        >
          <option value="">Alle problematieken</option>

          {(problematieken || []).map((problematiek, index) => (
            <option key={index} value={problematiek}>
              {problematiek.charAt(0).toUpperCase() + problematiek.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* REGIO INDDELING */}
      <div className="filter-group">
        <label>Regio</label>
        
        {["lokaal", "regionaal"].map((value) => (
        <label
          key={value}
          style={{
           display: "flex",
           alignItems: "center",
           gap: "10px",
           width: "100%"
          }}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        
          <input
            type="checkbox"
            value={value}
            checked={(filters.regio_indeling || []).includes(value)}
            onChange={(e) => {
              const checked = e.target.checked;
              let updated = filters.regio_indeling || [];
            
              if (checked) {
                updated = [...updated, value];
              } else {
                updated = updated.filter((v) => v !== value);
              }
            
              handleInputChange("regio_indeling", updated);
            }}
          />
        </label>
      ))}
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


      {/* SUMMARY */}
      <div className="filter-summary">
        <p className="filter-count">
          {Object.values(filters).filter((v) => v !== "").length} filter(s) actief
        </p>
      </div>
    </div>
  );
}

export default FilterPanel;
