import React, { useState } from "react";

function EditWachtrijModal({ zorgaanbieder, onClose, onSave }) {
  const [wachtrijOpmerking, setWachtrijOpmerking] = useState(zorgaanbieder.wachtrij_opmerking || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pak de datum van vandaag in YYYY-MM-DD formaat
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    //is een PATCH request naar de zorgaanbieder zelf
    fetch(`http://localhost:8000/api/zorgaanbieders/${zorgaanbieder.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wachtrij_opmerking: wachtrijOpmerking,
        wachtrij_laatst_aangepast: today,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Er ging iets mis bij het opslaan van de wachtrij.");
        return res.json();
      })
      .then((updatedZorgaanbieder) => {

        onSave(updatedZorgaanbieder);
        onClose();
      })
      .catch((err) => console.error(err))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Wachtrij aanpassen: {zorgaanbieder.name}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="modal-form">
            
            <div className="form-group">
              <label htmlFor="date">Datum laatste aanpassing</label>
              <input
                type="date"
                id="date"
                className="note-input"
                value={today}
                readOnly
                style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }} // Extra visuele feedback dat hij readonly is
              />
            </div>

            <div className="form-group">
              <label htmlFor="wachtrij">Wachtrij opmerking</label>
              <textarea
                id="wachtrij"
                className="note-textarea"
                rows="4"
                value={wachtrijOpmerking}
                onChange={(e) => setWachtrijOpmerking(e.target.value)}
                placeholder="Wachtrij opmerking..."
              ></textarea>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="note-cancel-btn" 
                onClick={onClose} 
                disabled={isSubmitting}
              >
                Annuleren
              </button>
              <button 
                type="submit" 
                className="note-submit-btn" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Opslaan..." : "Wachtrij opslaan"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditWachtrijModal;