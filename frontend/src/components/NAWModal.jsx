import React, { useEffect } from "react";

function NAWModal({ zorgaanbieder, onClose }) {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>NAW Gegevens</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="naw-section">
            <h3>Bedrijfsinformatie</h3>
            <div className="naw-grid">
              <div className="naw-item">
                <label>Naam:</label>
                <span>{zorgaanbieder.naam ?? zorgaanbieder.name ?? "-"}</span>
              </div>
              <div className="naw-item">
                <label>Email:</label>
                {zorgaanbieder.naw?.email || zorgaanbieder.email ? (
                  <a
                    href={`mailto:${zorgaanbieder.naw?.email ?? zorgaanbieder.email}`}
                  >
                    {zorgaanbieder.naw?.email ?? zorgaanbieder.email}
                  </a>
                ) : (
                  <span>-</span>
                )}
              </div>
            </div>
          </div>

          <div className="naw-section">
            <h3>Adresgegevens</h3>
            <div className="naw-grid">
              <div className="naw-item">
                <label>Adres:</label>
                <span>
                  {zorgaanbieder.naw?.adres ?? zorgaanbieder.address ?? "-"}
                </span>
              </div>

              <div className="naw-item">
                <label>Postcode:</label>
                <span>
                  {zorgaanbieder.naw?.postcode ?? zorgaanbieder.postcode ?? "-"}
                </span>
              </div>
              <div className="naw-item">
                <label>Stad:</label>
                <span>
                  {zorgaanbieder.naw?.stad ??
                    zorgaanbieder.city ??
                    zorgaanbieder.stad ??
                    "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="naw-section">
            <h3>Contactgegevens</h3>
            <div className="naw-grid">
              <div className="naw-item">
                <label>Telefoon 1:</label>
                <span>
                  {zorgaanbieder.naw?.telefoon ??
                    zorgaanbieder.phone_number_1 ??
                    zorgaanbieder.phone ??
                    "-"}
                </span>
              </div>
              <div className="naw-item">
                <label>Telefoon 2:</label>
                <span>
                  {zorgaanbieder.naw?.telefoon ??
                    zorgaanbieder.phone_number_2 ??
                    zorgaanbieder.phone ??
                    "-"}
                </span>
              </div>
              <div className="naw-item">
                <label>Telefoon 3:</label>
                <span>
                  {zorgaanbieder.naw?.telefoon ??
                    zorgaanbieder.phone_number_3 ??
                    zorgaanbieder.phone ??
                    "-"}
                </span>
              </div>
            </div>
          </div>
          <div className="naw-section">
            <h3>Opmerkingen</h3>
            {zorgaanbieder.notes && zorgaanbieder.notes.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[...zorgaanbieder.notes]
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map((note, index) => (
                    <div key={note.id || index} className="note-info">
                      <div className="note-text">"{note.text}"</div>
                      <div className="note-meta-block">
                        <div className="note-owner">
                          ~ {note.owner || "Onbekend"}
                        </div>
                        {note.created_at && (
                          <div className="note-date">
                            {new Date(note.created_at).toLocaleDateString("nl-NL")}
                            {" "}om{" "}
                            {new Date(note.created_at).toLocaleTimeString("nl-NL", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>
                Er zijn nog geen opmerkingen geplaatst voor deze zorgaanbieder.
              </p>
            )}
          </div>
          <div className="naw-section">
            <h3>Producten</h3>
            <div className="producten-list">
              {(zorgaanbieder.producten || []).map((product) => (
                <span
                  key={product.id ?? product.name}
                  className="product-badge"
                >
                  {product.name ?? product}
                </span>
              ))}
            </div>
          </div>

          <div className="naw-section">
            <h3>Problematiek</h3>
            <div className="problematieken-list">
              {(zorgaanbieder.problematieken || []).map((problematiek) => (
                <span
                  key={problematiek.id ?? problematiek.name}
                  className="problematiek-badge"
                >
                  {problematiek.name ?? problematiek}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="secondary-btn" onClick={onClose}>
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
}

export default NAWModal;