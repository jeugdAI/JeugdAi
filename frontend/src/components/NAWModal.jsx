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
              {/* <div className="naw-item">
                  <label>Type:</label>
                  <span>{zorgaanbieder.type ?? "-"}</span>
                </div>
                <div className="naw-item">
                  <label>Capaciteit:</label>
                  <span>{zorgaanbieder.capaciteit ?? zorgaanbieder.capacity ?? "-"} plaatsen</span>
                </div> */}
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
              {/* <div className="naw-item">
                <label>Email:</label>
                <span>{zorgaanbieder.naw?.email ?? zorgaanbieder.email ?? "-"}</span>
              </div> */}
              {/* <div className="naw-item">
                <label>Contactpersoon:</label>
                <span>{zorgaanbieder.naw?.contactpersoon ?? zorgaanbieder.contact_person ?? "-"}</span>
              </div> */}
            </div>
          </div>

          <div className="naw-section">
            <h3>Specialisaties</h3>
            <div className="specialisaties-list">
              {(zorgaanbieder.specialisaties || []).map((spec) => (
                <span
                  key={spec.id ?? spec.name}
                  className="specialisatie-badge"
                >
                  {spec.name ?? spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="secondary-btn" onClick={onClose}>
            Sluiten
          </button>
          {/* <button className="primary-btn">Contact opnemen</button> */}
        </div>
      </div>
    </div>
  );
}

export default NAWModal;
