import React from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";

function ZorgaanbiederTile({ zorgaanbieder, onAddNoteClick, onDetailsClick }) {
  const REGIO_LABELS = {
    lokaal: "Lokaal",
    regionaal: "Regionaal",
  };

  const latestNote = zorgaanbieder.notes && zorgaanbieder.notes.length > 0
    ? [...zorgaanbieder.notes].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
    : null;

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

        {/* 2. Toon de opmerking als die bestaat */}
        {latestNote && (
          <div className="note-container">
            <div className="note-label">Laatste opmerking</div>
            <div className="note-info">
              <div className="note-text">
                "{latestNote.text}"
              </div>
              
              <div className="note-meta-block">
                <div className="note-owner">
                  ~ {latestNote.owner || "Onbekend"}
                </div>
                {latestNote.created_at && (
                  <div className="note-date">
                    {new Date(latestNote.created_at).toLocaleDateString("nl-NL")}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        </div>

      <div className="tile-footer">
        <button className="details-btn" onClick={(e) => handleButtonClick(e, onAddNoteClick)}>
          + Opmerking
        </button>
        <button className="details-btn">Bekijk details</button>
      </div>
    </div>
  );
}

export default ZorgaanbiederTile;