import React from 'react';
import '../assets/scss/Scoreboard.scss';

const Scoreboard = ({ score, totalScore, level, remainingQuestions }) => {
  return (
    <div id="scoreboard">
      <h3>Aktuelle Punkte: {score}</h3>
      <h3>Gesamtpunkte: {totalScore}</h3>
      <h3>Abschnitt: {level}</h3>
      <h4>Frage Nr: {remainingQuestions}</h4>
    </div>
  );
};

export default Scoreboard;
