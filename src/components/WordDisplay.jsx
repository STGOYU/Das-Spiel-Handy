import React from 'react';
import '../assets/scss/WordDisplay.scss';

const WordDisplay = ({ word, guessedLetters }) => {
  return (
    <div id="word">
      {word.split('').map((letter, index) => (
        <button
          key={index}
          className={`letter-button ${letter === ' ' ? 'space' : ''}`} // Boşluk için 'space' sınıfı ekliyoruz
        >
          {letter === ' ' ? ' ' : guessedLetters.includes(letter) ? letter.toUpperCase() : '_'}
        </button>
      ))}
    </div>
  );
};

export default WordDisplay;

