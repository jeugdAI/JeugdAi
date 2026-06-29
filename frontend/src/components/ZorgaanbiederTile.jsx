import React from "react";

function ZorgaanbiederTile({ zorgaanbieder, onAddNoteClick, onDetailsClick, onEditWachtrijClick }) {
  const REGIO_LABELS = {
    lokaal: "Lokaal",
    regionaal: "Regionaal",
  };

  const handleButtonClick = (e, callback) => {
    e.stopPropagation();
    if (callback) callback();
  };

  return (
    <div className="zorgaanbieder-tile" onClick={onDetailsClick}>
      <div className="tile-header">
        <h3 className="zorgaanbieder-naam">{zorgaanbieder.name}</h3>
      </div>

      <div className="tile-content">
        <div className="location-info">
          <div className="location-text">Regio:</div>
          <span
            className={`stad ${
              zorgaanbieder.regio_indeling === "lokaal"
                ? "stad-lokaal"
                : "stad-regionaal"
            }`}
          >
            {REGIO_LABELS[zorgaanbieder.regio_indeling] ||
              zorgaanbieder.regio_indeling}
          </span>
        </div>

        <div className="address-info">
          <div className="address-text">Adres:</div>
          <span className="address-full">
            {[
              zorgaanbieder.address,
              zorgaanbieder.postcode,
              zorgaanbieder.city,
            ]
              .filter(Boolean)
              .join(", ") || "Onbekend"}
          </span>
        </div>

        <div className="note-container">
          <div className="note-label">Laatste wachtrij opmerking:</div>
          <div className="note-info">
            
            <div className="note-text" style={{ fontStyle: !zorgaanbieder.wachtrij_opmerking ? 'italic' : 'normal', color: !zorgaanbieder.wachtrij_opmerking ? '#666' : 'inherit' }}>
              {zorgaanbieder.wachtrij_opmerking 
                ? `"${zorgaanbieder.wachtrij_opmerking}"` 
                : "Er is momenteel geen wachtrij opmerking bekend."}
            </div>
            
            {zorgaanbieder.wachtrij_opmerking && zorgaanbieder.wachtrij_laatst_aangepast && (
              <div className="note-meta-block">
                <div className="note-owner"></div> 
                <div className="note-date">
                  {new Date(zorgaanbieder.wachtrij_laatst_aangepast).toLocaleDateString("nl-NL")}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      <div className="tile-footer">
        <button className="details-btn" onClick={(e) => handleButtonClick(e, onEditWachtrijClick)}>
          Wachtrij opmerking
        </button>
        <button className="details-btn" onClick={(e) => handleButtonClick(e, onAddNoteClick)}>
          + Opmerking
        </button>
      </div>
    </div>
  );
}

export default ZorgaanbiederTile;