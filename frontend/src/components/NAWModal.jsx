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
                <span>{zorgaanbieder.naam}</span>
              </div>
              <div className="naw-item">
                <label>Type:</label>
                <span>{zorgaanbieder.type}</span>
              </div>
              <div className="naw-item">
                <label>Capaciteit:</label>
                <span>{zorgaanbieder.capaciteit} plaatsen</span>
              </div>
            </div>
          </div>

          <div className="naw-section">
            <h3>Adresgegevens</h3>
            <div className="naw-grid">
              <div className="naw-item">
                <label>Adres:</label>
                <span>{zorgaanbieder.naw.adres}</span>
              </div>

              <div className="naw-item">
                <label>Postcode:</label>
                <span>{zorgaanbieder.naw.postcode}</span>
              </div>
              <div className="naw-item">
                <label>Stad:</label>
                <span>{zorgaanbieder.naw.stad}</span>
              </div>
            </div>
          </div>

          <div className="naw-section">
            <h3>Contactgegevens</h3>
            <div className="naw-grid">
              <div className="naw-item">
                <label>Telefoon:</label>
                <span>{zorgaanbieder.naw.telefoon}</span>
              </div>
              <div className="naw-item">
                <label>Email:</label>
                <span>{zorgaanbieder.naw.email}</span>
              </div>
              <div className="naw-item">
                <label>Contactpersoon:</label>
                <span>{zorgaanbieder.naw.contactpersoon}</span>
              </div>
            </div>
          </div>

          <div className="naw-section">
            <h3>Specialisaties</h3>
            <div className="specialisaties-list">
              {zorgaanbieder.specialisaties.map((spec, index) => (
                <span key={index} className="specialisatie-badge">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="secondary-btn" onClick={onClose}>
            Sluiten
          </button>
          <button className="primary-btn">Contact opnemen</button>
        </div>
      </div>
    </div>
  );
}

export default NAWModal;
