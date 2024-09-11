import React from 'react';
import '../assets/scss/Alphabet.scss';

const Alphabet = ({ handleGuess, guessedLetters, correctLetters }) => {
  const keyboardLayout = ['qwertzuiop', 'asdfghjklä', 'yxcvbnmöüß'];

  return (
    <div id="alphabet">
      {keyboardLayout.map((row, index) => (
        <div key={index} className="keyboard-row">
          {row.split('').map(letter => {
            const isGuessed = guessedLetters.includes(letter);
            const isCorrect = correctLetters.includes(letter);

            let buttonClass = 'letter-button';
            if (isGuessed) {
              buttonClass += isCorrect ? ' correct' : ' wrong';
            }

            return (
              <button
                key={letter}
                className={buttonClass}
                onClick={() => handleGuess(letter)}
                disabled={isGuessed}
              >
                {letter.toUpperCase()}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Alphabet;
