import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import '../assets/scss/ConfettiCanvas.scss';

const ConfettiCanvas = ({ triggerConfetti }) => {
  useEffect(() => {
    if (triggerConfetti) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [triggerConfetti]);

  return <canvas id="confetti-canvas"></canvas>;
};

export default ConfettiCanvas;
