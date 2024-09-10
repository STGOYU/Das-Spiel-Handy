import React from 'react';
import '../assets/scss/TippDisplay.scss';

const TippDisplay = ({ tipp }) => {
  return (
    <div className="tipp-display">
      <span>{tipp ? tipp : '👆 Zum Starten klicken !'}</span>
    </div>
  );
};

export default TippDisplay;

