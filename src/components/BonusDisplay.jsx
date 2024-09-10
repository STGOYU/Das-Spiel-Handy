import React from 'react';
import '../assets/scss/BonusDisplay.scss'; // BonusDisplay için SCSS dosyası

const BonusDisplay = ({ bonusText }) => {
  return (
    <div className="bonus-container">
      {bonusText && <div className="bonus">{bonusText}</div>}
    </div>
  );
};

export default BonusDisplay;
