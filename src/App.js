import React, { useState, useEffect } from "react";
import Scoreboard from "./components/Scoreboard";
import BonusDisplay from "./components/BonusDisplay";
import ConfettiCanvas from "./components/ConfettiCanvas";
import RestartButton from "./components/RestartButton";
import TippDisplay from "./components/TippDisplay";
import words from "./words";
import "./assets/scss/_global.scss";
import logo from "./assets/img/logo.webp";
import tada from "./assets/sounds/tada.mp3";
import gitar from "./assets/sounds/gitar.mp3";
import horn from "./assets/sounds/horn.mp3";
import { SlVolume2 } from "react-icons/sl";
import { SlVolumeOff } from "react-icons/sl";

const TOTAL_QUESTIONS = 10; // Total number of questions

const App = () => {
  const [selectedWord, setSelectedWord] = useState("");
  const [selectedTipp, setSelectedTipp] = useState("");
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0); // Tüm bölümler için toplam skor
  const [level, setLevel] = useState(1); // Mevcut bölüm sayısı
  const [message, setMessage] = useState("");
  const [bonusText, setBonusText] = useState("");
  const [triggerConfetti, setTriggerConfetti] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60); // Başlangıç süresi 60 saniye
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [loading, setLoading] = useState(true); // Yükleme durumu
  const [answeredQuestionsCount, setAnsweredQuestionsCount] = useState(0); // Cevaplanan soru sayısı
  const [isMuted, setIsMuted] = useState(false); // Sesi kapatma durumu
  const [gameOver, setGameOver] = useState(false); // Oyun bitiş durumu
  const [gameResult, setGameResult] = useState(""); // Oyun sonucu: "success" veya "fail"

  

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
          handleGameOver();
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, isTimerRunning]);

  const startGame = () => {
    setScore(0);
    setAnsweredQuestionsCount(0);
    setMessage("");
    setTriggerConfetti(false);
    setTimeLeft(60);
    setIsTimerRunning(false);
    setGameOver(false);
    setGameResult("");
    loadNewQuestion(); // Load a new word and tip when the game starts
  };

  const nextLevel = () => {
    setScore(0); // Bölümdeki skoru sıfırla ama toplam skoru koru
    setAnsweredQuestionsCount(0);
    setMessage("");
    setTriggerConfetti(false);
    setTimeLeft(60);
    setIsTimerRunning(true);
    setGameOver(false);
    loadNewQuestion();
  };

  const loadNewQuestion = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    const selectedWordObj = words[randomIndex];
    setSelectedWord(selectedWordObj.word);
    setSelectedTipp(selectedWordObj.tipp);

    const correct = selectedWordObj.word;
    const allOptions = generateRandomOptions(correct);
    setOptions(allOptions);
    setCorrectAnswer(correct);
  };

  const generateRandomOptions = (correct) => {
    const options = [correct];
    while (options.length < 4) {
      const randomWord = words[Math.floor(Math.random() * words.length)].word;
      if (!options.includes(randomWord)) {
        options.push(randomWord);
      }
    }
    return options.sort(() => Math.random() - 0.5);
  };

  const handleOptionClick = (option) => {
    if (option === correctAnswer) {
      setScore(score + 30);
      setBonusText("+30");
      setTimeLeft(timeLeft + 30);
      playSound(gitar);
      setTriggerConfetti(true);
    } else {
      setScore(score - 10);
      setBonusText("-10");
      setTimeLeft(timeLeft - 10);
    }

    setTimeout(() => {
      setBonusText("");
      setTriggerConfetti(false);
    }, 2000);

    setAnsweredQuestionsCount(answeredQuestionsCount + 1);

    if (answeredQuestionsCount + 1 < TOTAL_QUESTIONS) {
      loadNewQuestion();
    } else {
      handleGameOver();
    }
  };

  const handleGameOver = () => {
    setIsTimerRunning(false);
    setGameOver(true);
    if (score > 0 && timeLeft > 0) {
      setTotalScore(totalScore + score); // Toplam skora mevcut skoru ekle
      setLevel(level + 1); // Sonraki bölüme geç
      setGameResult("success");
      setMessage("Herzlichen Glückwunsch, Sie haben den Abschnitt erfolgreich abgeschlossen.!");
      playSound(tada);
    } else {
      setGameResult("fail");
      setMessage("Game OVER!");
      playSound(horn);
    }
  };

  const resumeTimer = () => {
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
  };

  const getMessageStyle = () => {
    if (message.includes("Herzlichen Glückwunsch!")) {
      return { color: "#007bff" };
    } else if (message.includes("Game Over!")) {
      return { color: "#ff0000" };
    } else {
      return { color: "#28a745" };
    }
  };

  const handleNextLevel = () => {
    nextLevel();
  };

  const handleRestartGame = () => {
    setTotalScore(0); // Toplam skoru sıfırla
    setLevel(1); // Bölümü sıfırla
    startGame(); // Oyunu yeniden başlat
  };

  if (loading) {
    return (
      <div className="loading-container">
        <img src={logo} alt="Logo" />
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="game-over-container">
        <h2>{message}</h2>
        <Scoreboard
          score={score}
          totalScore={totalScore}
          level={level}
          remainingQuestions={TOTAL_QUESTIONS - answeredQuestionsCount}
        />
        {gameResult === "success" ? (
          <button className="next-button" onClick={handleNextLevel}>
            Next Level
          </button>
        ) : (
          <button className="restart-button" onClick={handleRestartGame}>
            Neu Spiel
          </button>
        )}
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
        <div className="options-container">
        {options.map((option, index) => (
          <button
            key={index}
            className="option-button"
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </button>
        ))}
      </div>   
      </div>
      
      <div id="message" className="message" style={getMessageStyle()}>
        {message}
      </div>
      <Scoreboard
          score={score}
          totalScore={totalScore}
          level={level}
          remainingQuestions={TOTAL_QUESTIONS - answeredQuestionsCount}
      />
      <BonusDisplay bonusText={bonusText} />
      <ConfettiCanvas triggerConfetti={triggerConfetti} />
    </div>
  );
};

export default App;
