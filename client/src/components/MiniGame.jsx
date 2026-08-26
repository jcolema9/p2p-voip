import { useEffect, useRef, useState } from 'react';

const MIN_SPAWN_DELAY = 5000;
const MAX_SPAWN_DELAY = 10000;
const FALL_DURATION = 15000;
const STAR_SIZE = 1.5;
const CATCHER_WIDTH = 2.33;
const CATCHER_STEP = CATCHER_WIDTH;
const STAR_PIXEL_SIZE = 4;

function createStar() {
  const viewportWidth = window.innerWidth || 1000;
  const maxX = viewportWidth - STAR_PIXEL_SIZE - 8;
  const startX = 8 + Math.random() * (maxX - 8);
  const endX = 8 + Math.random() * (maxX - 8);

  return {
    x: startX,
    startX,
    endX,
    y: -STAR_SIZE,
    bornAt: performance.now(),
  };
}

export default function MiniGame() {
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState([]);
  const [catcherPosition, setCatcherPosition] = useState(50 - CATCHER_WIDTH / 2);
  const fieldRef = useRef(null);
  const paddleRef = useRef(null);
  const animationRef = useRef(null);
  const starsRef = useRef([]);
  const nextStarIdRef = useRef(0);

  useEffect(() => {
    if (!isOpen) {
      setStars([]);
      starsRef.current = [];
      return undefined;
    }

    const spawn = () => {
      const nextStar = { ...createStar(), id: nextStarIdRef.current++ };
      starsRef.current = [...starsRef.current, nextStar];
      setStars(starsRef.current);
    };

    let spawnTimer;
    const scheduleSpawn = () => {
      const delay = MIN_SPAWN_DELAY + Math.random() * (MAX_SPAWN_DELAY - MIN_SPAWN_DELAY);
      spawnTimer = window.setTimeout(() => {
        spawn();
        scheduleSpawn();
      }, delay);
    };

    scheduleSpawn();
    const animate = (timestamp) => {
      const viewportHeight = window.innerHeight || 800;
      const paddleRect = paddleRef.current?.getBoundingClientRect();
      let caughtStars = 0;
      const nextStars = starsRef.current.reduce((remainingStars, activeStar) => {
        const nextY = ((timestamp - activeStar.bornAt) / FALL_DURATION) * 100 - STAR_SIZE;
        const progress = Math.max(0, (nextY + STAR_SIZE) / 100);
        const nextX = activeStar.startX + (activeStar.endX - activeStar.startX) * progress;
        const nextStar = { ...activeStar, x: nextX, y: nextY };
        const starTop = (nextY / 100) * viewportHeight;
        const starBottom = starTop + STAR_PIXEL_SIZE;
        const overlapsPaddle = paddleRect
          && starBottom >= paddleRect.top
          && starTop <= paddleRect.bottom
          && nextX + STAR_PIXEL_SIZE >= paddleRect.left
          && nextX <= paddleRect.right;

        if (overlapsPaddle) {
          caughtStars += 1;
          return remainingStars;
        }
        if (nextY > 100) return remainingStars;
        return [...remainingStars, nextStar];
      }, []);

      if (caughtStars > 0) {
        setScore((currentScore) => currentScore + caughtStars);
      }
      starsRef.current = nextStars;
      setStars(nextStars);

      animationRef.current = window.requestAnimationFrame(animate);
    };

    animationRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.clearTimeout(spawnTimer);
      window.cancelAnimationFrame(animationRef.current);
      starsRef.current = [];
    };
  }, [isOpen]);

  const moveCatcher = (direction) => {
    setCatcherPosition((currentPosition) => {
      const nextPosition = currentPosition + direction * CATCHER_STEP;
      return Math.max(0, Math.min(100 - CATCHER_WIDTH, nextPosition));
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') {
      event.preventDefault();
      moveCatcher(-1);
    }
    if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') {
      event.preventDefault();
      moveCatcher(1);
    }
  };

  const toggleGame = () => {
    setIsOpen((currentValue) => !currentValue);
    if (!isOpen) {
      window.requestAnimationFrame(() => fieldRef.current?.focus());
    }
  };

  return (
    <section className={`mini-game${isOpen ? ' mini-game--open' : ''}`}>
      {isOpen && (
        <div
          ref={fieldRef}
          className="mini-game-field"
          tabIndex="0"
          role="application"
          aria-label="Star catcher game. Use the arrow keys or A and D to move the catch line."
          onKeyDown={handleKeyDown}
        >
          {stars.map((star) => (
            <span
              key={star.id}
              className="mini-game-star"
              style={{
                left: `${star.x}px`,
                top: `${star.y}%`,
              }}
              aria-hidden="true"
            />
          ))}
          <span
            ref={paddleRef}
            className="mini-game-catcher"
            style={{ left: `${catcherPosition}%` }}
            aria-hidden="true"
          />
        </div>
      )}
      <div className="mini-game-footer">
        <button
          type="button"
          className="mini-game-toggle"
          aria-expanded={isOpen}
          onClick={toggleGame}
        >
          {isOpen ? 'Hide stars' : 'Stars'}
        </button>
        <span className="mini-game-score" aria-live="polite">{score}</span>
      </div>
    </section>
  );
}
