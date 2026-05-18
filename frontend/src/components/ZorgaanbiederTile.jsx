import React from "react";

function ZorgaanbiederTile({ zorgaanbieder, onClick }) {
  // const getRatingStars = (rating) => {
  //   const stars = [];
  //   const fullStars = Math.floor(rating);
  //   const hasHalfStar = rating % 1 !== 0;

  //   for (let i = 0; i < fullStars; i++) {
  //     stars.push(
  //       <span key={i} className="star full">
  //         ★
  //       </span>,
  //     );
  //   }

  //   if (hasHalfStar) {
  //     stars.push(
  //       <span key="half" className="star half">
  //         ★
  //       </span>,
  //     );
  //   }

  //   const emptyStars = 5 - Math.ceil(rating);
  //   for (let i = 0; i < emptyStars; i++) {
  //     stars.push(
  //       <span key={`empty-${i}`} className="star empty">
  //         ☆
  //       </span>,
  //     );
  //   }

  //   return stars;
  // };

  return (
    <div className="zorgaanbieder-tile" onClick={onClick}>
      <div className="tile-header">
        <h3 className="zorgaanbieder-naam">{zorgaanbieder.name}</h3>
        {/* <span className="zorgaanbieder-type">{zorgaanbieder.status}</span> */}
      </div>

      <div className="tile-content">
        <div className="location-info">
          <span className="stad">📍 {zorgaanbieder.city}</span>
          {/* <span className="capaciteit">👥 {zorgaanbieder.capaciteit} plaatsen</span> */}
        </div>

        {/* <div className="rating">
          <div className="stars">
            {getRatingStars(zorgaanbieder.rating)}
          </div>
          <span className="rating-number">{zorgaanbieder.rating}</span>
        </div> */}

        <div className="specialisaties">
          {zorgaanbieder.specialisaties.slice(0, 2).map((spec) => (
            <span key={spec.id ?? spec.name} className="specialisatie-tag">
              {spec.name ?? spec}
            </span>
          ))}
          {zorgaanbieder.specialisaties.length > 2 && (
            <span className="specialisatie-tag more">
              +{zorgaanbieder.specialisaties.length - 2}
            </span>
          )}
        </div>
      </div>

      <div className="tile-footer">
        <button className="details-btn">Bekijk details</button>
      </div>
    </div>
  );
}

export default ZorgaanbiederTile;
