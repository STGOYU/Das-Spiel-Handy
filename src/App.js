import React, { useState, useEffect } from "react";
import Scoreboard from "./components/Scoreboard";
import WordDisplay from "./components/WordDisplay";
import BonusDisplay from "./components/BonusDisplay";
import ConfettiCanvas from "./components/ConfettiCanvas";
import RestartButton from "./components/RestartButton";
import TippDisplay from "./components/TippDisplay";
import words from "./words";
import "./assets/scss/_global.scss";
import logo from "./assets/img/logo.webp";
import dark from "./assets/sounds/dark.mp3";
import tada from "./assets/sounds/tada.mp3";
import gitar from "./assets/sounds/gitar.mp3";
import horn from "./assets/sounds/horn.mp3";
import music from "./assets/sounds/music.mp3"
import { SlVolume2 } from "react-icons/sl";
import { SlVolumeOff } from "react-icons/sl";

const TOTAL_QUESTIONS = 10; // Total number of questions

const App = () => {
  const [selectedWord, setSelectedWord] = useState("");
  const [selectedTipp, setSelectedTipp] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [bonusText, setBonusText] = useState("");
  const [triggerConfetti, setTriggerConfetti] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60); // Initial time of 60 seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [answeredQuestionsCount, setAnsweredQuestionsCount] = useState(0); // Number of answered questions
  const [isMuted, setIsMuted] = useState(false); // State to track if sound is muted
  const [inputValue, setInputValue] = useState(""); 
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); 
  const [isInputFocused, setIsInputFocused] = useState(true); 

  // Play sound function
  const playSound = (sound) => {
    if (!isMuted) {
      const audio = new Audio(sound);
      audio.play().catch((error) => {
        console.error("Error playing sound:", error);
      });
    }
  };

  const toggleSound = () => {
    setIsMuted(!isMuted); // Toggle the sound state
  };

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /android|iphone|ipad|ipod|windows phone/i.test(userAgent);
    setIsMobile(isMobileDevice); 
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let timer;
    if (isTimerRunning) {
      timer = setInterval(() => {
        if (timeLeft > 0) {
          setTimeLeft(timeLeft - 1);
        } else {
          handleTimeOut();
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, isTimerRunning]);

  const startGame = () => {
    setGuessedLetters([]);
    setCorrectLetters([]);
    setScore(0);
    setAnsweredQuestionsCount(0);
    setMessage("");
    setTriggerConfetti(false);
    setTimeLeft(60);
    setIsTimerRunning(false);
    loadNewWord(); // Load a new word and tip when the game starts
    setIsInputFocused(true);
  };

  const loadNewWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    const selectedWordObj = words[randomIndex];
    setSelectedWord(selectedWordObj.word);
    setSelectedTipp(selectedWordObj.tipp);
  };

  const resumeTimer = () => {
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
  };

  const handleTimeOut = () => {
    setMessage(
      `Game Over! Das richtige Wort war: ${selectedWord.toUpperCase()}`
    );
    playSound(horn);
    setIsTimerRunning(false);
  };

  // Klavye girdisini yönetme fonksiyonu
  const handleKeyPress = (event) => {
    const pressedKey = event.key.toLowerCase(); // Basılan tuşu küçük harfe çevirir
    if (/^[a-zäöü]$/.test(pressedKey) && !guessedLetters.includes(pressedKey)) {
      handleGuess(pressedKey);
    }
  };

  const handleInputChange = (event) => {
    const letter = event.target.value.toLowerCase(); // Girilen harfi al ve küçük harfe çevir
    if (/^[a-zäöü]$/.test(letter)) { // Sadece geçerli bir harf girilmişse işleme devam et
      handleGuess(letter);
    }
  };

  const handleNewWord = () => {
    setInputValue(''); // Yeni kelimeye geçince input'u temizle
  };

  // Ekran boyutuna göre input görünürlüğünü belirlemek için bir event listener ekle
  window.addEventListener('resize', () => {
    setIsMobile(window.innerWidth <= 768);
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [guessedLetters, isTimerRunning]);

  const handleGuess = (letter) => {
    if (!isTimerRunning) return; // Zamanlayıcı çalışmıyorsa tahmin yapmayı engelle

    if (guessedLetters.includes(letter)) return; // Zaten tahmin edilen harfse tekrar tahmin edilmez
    setGuessedLetters([...guessedLetters, letter]);

    if (selectedWord.includes(letter)) {
      playSound(dark);
      const occurrences = selectedWord.split("").filter((l) => l === letter).length;
      setCorrectLetters([...correctLetters, letter]);
      const pointsEarned = occurrences * 10;
      setScore(score + pointsEarned);
      setBonusText(`+${pointsEarned}`);

      const updatedGuessedLetters = [...guessedLetters, letter];
      const wordDisplay = selectedWord
        .split("")
        .map((l) => (updatedGuessedLetters.includes(l) ? l : "_"))
        .join("");

      if (wordDisplay === selectedWord) {
        setTriggerConfetti(true);
        playSound(gitar);
        setScore(score + 20);
        setBonusText(`+20`);
        setAnsweredQuestionsCount(answeredQuestionsCount + 1);

        setTimeout(() => {
          if (answeredQuestionsCount + 1 === TOTAL_QUESTIONS) {
            playSound(tada);
            setMessage("Herzlichen Glückwunsch!");
            setTriggerConfetti(true);
            setIsTimerRunning(false);
          } else {
            loadNewWord();
            setTimeLeft(timeLeft + 5 * occurrences);
            setGuessedLetters([]);
            setCorrectLetters([]);
          }
        }, 2000);
      } else {
        setTimeLeft(timeLeft + 5 * occurrences);
      }

      setTimeout(() => {
        setBonusText("");
      }, 2000);
    } else {
      setTimeLeft(timeLeft - 3);

      if (timeLeft < 1) {
        handleTimeOut();
      }
    }
  };

  const getMessageStyle = () => {
    if (message.includes("Herzlichen Glückwunsch!")) {
      return { color: "#007bff" };
    } else if (message.includes("Game Over!")) {
      return { color: "#ff0000" };
    } else {
      return { color: "#ff5733" };
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <img src={logo} alt="Logo" />
      </div>
    );
  }

  return (
    <div className="container text-center">
      <h1>Das Ratespiel</h1>
      <RestartButton
        startGame={startGame}
        resumeTimer={resumeTimer}
        stopTimer={stopTimer}
        playSound={playSound}
      />
      <div className="grid-container">
        <div className="voice-container">
          {isMuted ? (
            <SlVolumeOff onClick={toggleSound} className="voice" size={10} />
          ) : (
            <SlVolume2 onClick={toggleSound} className="voice" size={10} />
          )}
        </div>
        <TippDisplay
          tipp={selectedTipp}
        />
        <div className="timer-container">
        <div id="timer" className="timer">
          {timeLeft}
        </div>
        </div>
        <WordDisplay word={selectedWord} guessedLetters={guessedLetters} />
        <div className="input-container">
          {isMobile && (
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              maxLength={1}
              autoFocus={isInputFocused}
              className="input" 
            />
          )}
        </div>
      </div>
      <div id="message" className="message" style={getMessageStyle()}>
        {message}
      </div>
      <Scoreboard
        score={score}
        remainingQuestions={TOTAL_QUESTIONS - answeredQuestionsCount}
      />
      <BonusDisplay bonusText={bonusText} />
      <ConfettiCanvas triggerConfetti={triggerConfetti} />
    </div>
  );
};

export default App;
