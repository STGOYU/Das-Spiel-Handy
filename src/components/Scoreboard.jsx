import React from 'react';
import '../assets/scss/Scoreboard.scss';

const Scoreboard = ({ score, remainingQuestions }) => {
  return (
    <div id="scoreboard">
      <span className="score-player">
        Ergebnis: {score}
      </span>
      <span className="remaining-questions">
        Frage Nr: {remainingQuestions}
      </span>
    </div>
  );
};

export default Scoreboard;
