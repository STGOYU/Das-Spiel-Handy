import React, { useState } from "react";
import "../assets/scss/RestartButton.scss";
import stopSound from "../assets/sounds/dark.mp3";

const RestartButton = ({ startGame, resumeTimer, stopTimer, playSound }) => {
  const [isStartDisabled, setIsStartDisabled] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleStartClick = () => {
    if (!isStartDisabled) {
      if (!isGameStarted) {
        startGame(); // Call startGame only if the game hasn't started before
        setIsGameStarted(true); // Set the game as started
      }
     // playSound(startSound); // Play the start sound
      resumeTimer();
      setIsStartDisabled(true);
    }
  };

  const handleStopClick = () => {
    playSound(stopSound); // Play the stop sound
    stopTimer();
    setIsStartDisabled(false);
  };

  const handleRestartClick = () => {
    if (!isStartDisabled) {
      if (isGameStarted) {
        startGame(); // Call startGame only if the game hasn't started before
        setIsGameStarted(true); // Set the game as started
        resumeTimer();
      }
     // playSound(startSound); // Play the start sound
      setIsStartDisabled(false);
    }
  };

  return (
    <div className="button-group">
      <button id="start" className="btn btn-primary" onClick={handleStartClick}  disabled={isStartDisabled}>
        START
      </button>
      <button id="stop" className="btn btn-primary" onClick={handleStopClick}>
        STOP
      </button>
      <button
        id="restart"
        className="btn btn-primary"
        onClick={handleRestartClick}
      >
        RESTART
      </button>
    </div>
  );
};

export default RestartButton;
