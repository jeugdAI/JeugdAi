import React, { useState } from "react";

function AddNoteModal({ zorgaanbieder, onClose, onSave }) {
  const [text, setText] = useState("");
  const [owner, setOwner] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);

    fetch("http://localhost:8000/api/opmerkingen/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        provider: zorgaanbieder.id,
        text: text,
        owner: owner || "Anoniem",
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Er ging iets mis.");
        return res.json();
      })
      .then((newNote) => {
        onSave(zorgaanbieder.id, newNote);
        onClose();
      })
      .catch((err) => console.error(err))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2>+ Opmerking voor {zorgaanbieder.name}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="modal-form">
            
            <div className="form-group">
              <label htmlFor="owner">Naam</label>
              <input
                type="text"
                id="owner"
                className="note-input"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Voornaam & Achternaam"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="text">Opmerking</label>
              <textarea
                id="text"
                className="note-textarea"
                rows="4"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Typ hier de opmerking..."
                required
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
                {isSubmitting ? "Opslaan..." : "Opmerking opslaan"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNoteModal;