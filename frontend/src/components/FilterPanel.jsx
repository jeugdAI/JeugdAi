import React from 'react'

function FilterPanel({ filters, onFilterChange, zorgTypes, steden, specialisaties }) {
  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value })
  }

  const clearFilters = () => {
    onFilterChange({
      type: '',
      stad: '',
      specialisatie: '',
      search: ''
    })
  }

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="clear-filters-btn" onClick={clearFilters}>
          Wis filters
        </button>
      </div>

      <div className="filter-group">
        <label htmlFor="search">Zoeken</label>
        <input
          type="text"
          id="search"
          placeholder="Naam van zorgaanbieder..."
          value={filters.search}
          onChange={(e) => handleInputChange('search', e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label htmlFor="type">Type zorg</label>
        <select
          id="type"
          value={filters.type}
          onChange={(e) => handleInputChange('type', e.target.value)}
          className="filter-select"
        >
          <option value="">Alle types</option>
          {zorgTypes.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="stad">Stad</label>
        <select
          id="stad"
          value={filters.stad}
          onChange={(e) => handleInputChange('stad', e.target.value)}
          className="filter-select"
        >
          <option value="">Alle steden</option>
          {steden.map(stad => (
            <option key={stad} value={stad}>
              {stad}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="specialisatie">Specialisatie</label>
        <select
          id="specialisatie"
          value={filters.specialisatie}
          onChange={(e) => handleInputChange('specialisatie', e.target.value)}
          className="filter-select"
        >
          <option value="">Alle specialisaties</option>
          {specialisaties.map(spec => (
            <option key={spec} value={spec}>
              {spec.charAt(0).toUpperCase() + spec.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-summary">
        <p className="filter-count">
          {Object.values(filters).filter(value => value !== '').length} filters actief
        </p>
      </div>
    </div>
  )
}

export default FilterPanel
