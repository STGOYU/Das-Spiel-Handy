import React, { useState } from "react";
import "../assets/scss/RestartButton.scss";
import stopSound from "../assets/sounds/dark.mp3";

const RestartButton = ({ startGame, resumeTimer, stopTimer, playSound, isGameStarted, setAreOptionsDisabled, handleGameOver  }) => {
  const [isStartDisabled, setIsStartDisabled] = useState(false);

  const handleStartClick = () => {
    if (!isStartDisabled) {
      if (!isGameStarted) {
        startGame(); // Call startGame only if the game hasn't started before
      }
     // playSound(startSound); // Play the start sound
      resumeTimer();
      setIsStartDisabled(true);
      setAreOptionsDisabled(false); 
    }
  };

  const handleStopClick = () => {
    playSound(stopSound); // Play the stop sound
    stopTimer();
    setIsStartDisabled(false);
    setAreOptionsDisabled(true);
  };

  const handleRestartClick = () => {
    if (!isStartDisabled) {
      if (isGameStarted) {
        handleGameOver(); // Call startGame only if the game hasn't started before
        stopTimer();
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
        FINISH
      </button>
    </div>
  );
};

export default RestartButton;
