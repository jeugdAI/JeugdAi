import React from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";

function ZorgaanbiederTile({ zorgaanbieder, onClick }) {

  const REGIO_LABELS = {
  lokaal: "Lokaal",
  regionaal: "Regionaal",
};

  return (
    <div className="zorgaanbieder-tile" onClick={onClick}>
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
          </span>        </div>
        
        <div className= "address-info">
          <div className="address-text">Adres:</div>
          <span className="address-full">
            {[
                  zorgaanbieder.address,
                  zorgaanbieder.postcode,
                  zorgaanbieder.city,
              ]
                .filter(Boolean)
                .join(", ") || "Onbekend"
            }
          </span>
        </div>


        {/* <div className="producten">
          <span className="producten-label">Producten:</span>
          
          {zorgaanbieder.producten && zorgaanbieder.producten.length > 0 ? (
            <>
              {zorgaanbieder.producten.slice(0, 2).map((product) => (
                <span key={product.id ?? product.name} className="product-tag">
                  {product.name ?? product}
                </span>
              ))}
        
              {zorgaanbieder.producten.length > 2 && (
                <span className="product-tag more">
                  +{zorgaanbieder.producten.length - 2}
                </span>
              )}
            </>
          ) : (
            <span className="product-tag empty">Leeg</span>
          )}
        </div> */}

        {/* <div className="behandelingen">
          <span className="behandelingen-label">Behandelingen:</span>

          {zorgaanbieder.behandelingen && zorgaanbieder.behandelingen.length > 0 ? (
            <>
              {zorgaanbieder.behandelingen.slice(0, 2).map((behandeling) => (
                <span key={behandeling.id ?? behandeling.name} className="behandeling-tag">
                  {behandeling.name ?? behandeling}
                </span>
              ))}

              {zorgaanbieder.behandelingen.length > 2 && (
                <span className="behandeling-tag more">
                  +{zorgaanbieder.behandelingen.length - 2}
                </span>
              )}
            </>
          ) : (
            <span className="behandeling-tag empty">Leeg</span>
          )}
        </div> */}
      </div>

      <div className="tile-footer">
        <button className="details-btn">Bekijk details</button>
      </div>
    </div>
  );
}

export default ZorgaanbiederTile;
