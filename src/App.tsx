import { useState, useCallback, useRef, useEffect } from 'react';
import './App.css';
import { getRandomCard, allCards, type Card } from './data/cards';
import { useShake } from './hooks/useShake';
import { useTimer } from './hooks/useTimer';

type Screen = 'start' | 'game' | 'end';

interface PlayerScore {
  name: string;
  score: number;
}

function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [players, setPlayers] = useState<string[]>([]);
  const [playerInput, setPlayerInput] = useState('');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [cardAnimClass, setCardAnimClass] = useState('');
  const [cardRevealed, setCardRevealed] = useState(false);

  const timer = useTimer(30);
  const inputRef = useRef<HTMLInputElement>(null);

  const drawCard = useCallback(() => {
    const result = getRandomCard(usedIndices);
    if (!result) {
      setScreen('end');
      return;
    }

    timer.stop();
    setCardAnimClass('entering');
    setCurrentCard(result.card);
    setCardRevealed(true);
    setUsedIndices((prev) => new Set(prev).add(result.index));
    timer.start();

    setTimeout(() => setCardAnimClass(''), 500);
  }, [usedIndices, timer]);

  const handleShake = useCallback(() => {
    if (screen !== 'game') return;
    if (timer.isRunning) return; // don't allow shake while timer is active
    drawCard();
  }, [screen, timer.isRunning, drawCard]);

  const { requestPermission } = useShake(handleShake, screen === 'game');

  const addPlayer = () => {
    const name = playerInput.trim();
    if (name && !players.includes(name)) {
      setPlayers((prev) => [...prev, name]);
      setPlayerInput('');
      inputRef.current?.focus();
    }
  };

  const removePlayer = (name: string) => {
    setPlayers((prev) => prev.filter((p) => p !== name));
  };

  const startGame = async () => {
    if (players.length < 2) return;
    await requestPermission();
    setScores(players.map((name) => ({ name, score: 0 })));
    setCurrentPlayerIndex(0);
    setUsedIndices(new Set());
    setCurrentCard(null);
    setCardRevealed(false);
    timer.reset();
    setScreen('game');
  };

  const handleDone = () => {
    setScores((prev) =>
      prev.map((s) =>
        s.name === players[currentPlayerIndex]
          ? { ...s, score: s.score + 1 }
          : s
      )
    );
    nextTurn();
  };

  const nextTurn = () => {
    timer.stop();
    setCurrentCard(null);
    setCardRevealed(false);

    const nextIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextIndex);

    // Check if all cards used
    if (usedIndices.size >= allCards.length) {
      setScreen('end');
    }
  };

  const handleSkip = () => {
    nextTurn();
  };

  const resetGame = () => {
    setScreen('start');
    setCurrentCard(null);
    setUsedIndices(new Set());
    setCardRevealed(false);
    timer.reset();
  };

  // Handle keydown for player input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addPlayer();
  };

  // Timer ring SVG values
  const TIMER_DURATION = 30;
  const circumference = 2 * Math.PI * 34;
  const progress = timer.timeLeft / TIMER_DURATION;
  const dashOffset = circumference * (1 - progress);

  const timerColorClass =
    timer.timeLeft <= 5 ? 'danger' : timer.timeLeft <= 10 ? 'warning' : '';

  // Allow tap on card area to draw a new card (for desktop / fallback)
  const handleCardAreaClick = () => {
    if (!cardRevealed && !timer.isRunning) {
      drawCard();
    }
  };

  // Vibrate on timer expiry
  useEffect(() => {
    if (timer.isExpired && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  }, [timer.isExpired]);

  return (
    <div className="app">
      {screen === 'start' && (
        <div className="start-screen">
          <div className="emoji-title">🎲</div>
          <h1>Правда или Действие</h1>

          <div className="player-setup">
            <label>Добавь игроков:</label>
            <div className="player-input-row">
              <input
                ref={inputRef}
                type="text"
                placeholder="Имя игрока..."
                value={playerInput}
                onChange={(e) => setPlayerInput(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={20}
              />
              <button onClick={addPlayer} type="button">+</button>
            </div>

            {players.length > 0 && (
              <div className="player-list">
                {players.map((name) => (
                  <div className="player-chip" key={name}>
                    <span>{name}</span>
                    <button onClick={() => removePlayer(name)} type="button">
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            className="start-btn"
            disabled={players.length < 2}
            onClick={startGame}
          >
            {players.length < 2
              ? `Добавь ещё ${2 - players.length} игрок(ов)`
              : 'Начать игру!'}
          </button>
        </div>
      )}

      {screen === 'game' && (
        <div className="game-screen">
          <div className="game-header">
            <div className="current-player" key={currentPlayerIndex}>
              {players[currentPlayerIndex]}
            </div>
            <div className="player-indicator">
              Игрок {currentPlayerIndex + 1} из {players.length}
            </div>
          </div>

          {!cardRevealed ? (
            <div className="card-idle" onClick={handleCardAreaClick}>
              <div className="shake-icon">📱</div>
              <p>Потряси телефон или нажми сюда!</p>
            </div>
          ) : (
            <div className="card-container">
              {currentCard && (
                <div className={`card ${currentCard.type} ${cardAnimClass}`}>
                  <div className="card-type">
                    {currentCard.type === 'truth' ? 'Правда' : 'Действие'}
                  </div>
                  <div className="card-icon">
                    {currentCard.type === 'truth' ? '🤔' : '🎬'}
                  </div>
                  <div className="card-text">{currentCard.text}</div>
                </div>
              )}
            </div>
          )}

          <div className="timer-section">
            {cardRevealed && (
              <>
                <div className="timer-ring">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle
                      className="timer-ring-bg"
                      cx="40"
                      cy="40"
                      r="34"
                    />
                    <circle
                      className="timer-ring-progress"
                      cx="40"
                      cy="40"
                      r="34"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      style={{
                        stroke:
                          timerColorClass === 'danger'
                            ? '#ff4444'
                            : timerColorClass === 'warning'
                            ? '#ffd700'
                            : 'white',
                      }}
                    />
                  </svg>
                  <div
                    className={`timer-text ${timer.isExpired ? 'timer-expired' : ''}`}
                  >
                    {timer.timeLeft}
                  </div>
                </div>

                <div className="game-controls">
                  <button className="btn-next" onClick={handleSkip}>
                    Пропустить
                  </button>
                  <button className="btn-done" onClick={handleDone}>
                    Выполнено!
                  </button>
                </div>
              </>
            )}
            <button className="btn-back" onClick={resetGame}>
              Выйти
            </button>
          </div>
        </div>
      )}

      {screen === 'end' && (
        <div className="end-screen">
          <div className="trophy">🏆</div>
          <h2>Игра окончена!</h2>
          <p>Карточки закончились. Вот результаты:</p>

          <div className="scores">
            {[...scores]
              .sort((a, b) => b.score - a.score)
              .map((s) => (
                <div className="score-row" key={s.name}>
                  <span>{s.name}</span>
                  <span className="score-points">{s.score} очк.</span>
                </div>
              ))}
          </div>

          <button className="start-btn" onClick={resetGame}>
            Играть снова
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
