import React, { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

const pad = (n) => n.toString().padStart(2, '0');

const FlipDigit = ({ digit, prevDigit, animate }) => (
  <div className="fliqlo-digit">
    <div className="fliqlo-upper">{pad(digit)}</div>
    <div className="fliqlo-lower">{pad(prevDigit)}</div>
    <div className={`fliqlo-flip-card${animate ? ' fliqlo-flip' : ''}`}>
      <div className="fliqlo-flip-front">{pad(prevDigit)}</div>
      <div className="fliqlo-flip-back">{pad(digit)}</div>
    </div>
  </div>
);

const FliqloFlipClock = ({ minutes, seconds }) => {
  // Animation state
  const [prevMinutes, setPrevMinutes] = useState(minutes);
  const [prevSeconds, setPrevSeconds] = useState(seconds);
  const [minFlip, setMinFlip] = useState(false);
  const [secFlip, setSecFlip] = useState(false);

  useEffect(() => {
    if (minutes !== prevMinutes) {
      setMinFlip(true);
      setTimeout(() => setMinFlip(false), 600);
      setPrevMinutes(minutes);
    }
    // eslint-disable-next-line
  }, [minutes]);

  useEffect(() => {
    if (seconds !== prevSeconds) {
      setSecFlip(true);
      setTimeout(() => setSecFlip(false), 600);
      setPrevSeconds(seconds);
    }
    // eslint-disable-next-line
  }, [seconds]);

  return (
    <div className="fliqlo-flip-clock">
      <FlipDigit digit={minutes} prevDigit={prevMinutes} animate={minFlip} />
      <div className="fliqlo-colon">:</div>
      <FlipDigit digit={seconds} prevDigit={prevSeconds} animate={secFlip} />
      <style>{`
        .fliqlo-flip-clock {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #111216;
          border-radius: 2rem;
          padding: 2.5rem 4rem;
          box-shadow: 0 8px 32px #000a;
        }
        .fliqlo-digit {
          position: relative;
          width: 110px;
          height: 150px;
          margin: 0 12px;
          perspective: 700px;
        }
        .fliqlo-upper, .fliqlo-lower {
          width: 100%;
          height: 50%;
          font-size: 5.5rem;
          color: #fff;
          background: #18181b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Droid Sans Mono', 'monospace';
          font-weight: 700;
          letter-spacing: 0.05em;
          border-radius: 12px 12px 0 0;
          border-bottom: 1.5px solid #222;
          box-shadow: 0 2px 8px #0005;
        }
        .fliqlo-lower {
          border-radius: 0 0 12px 12px;
          border-top: none;
          border-bottom: none;
        }
        .fliqlo-flip-card {
          position: absolute;
          left: 0; width: 100%;
          height: 50%;
          top: 0;
          z-index: 2;
          transform-style: preserve-3d;
          pointer-events: none;
        }
        .fliqlo-flip-card.fliqlo-flip {
          animation: fliqlo-flip 0.6s cubic-bezier(.4,2,.6,1) forwards;
        }
        .fliqlo-flip-front, .fliqlo-flip-back {
          position: absolute;
          width: 100%; height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 5.5rem;
          color: #fff;
          background: #18181b;
          font-family: 'Droid Sans Mono', 'monospace';
          font-weight: 700;
          letter-spacing: 0.05em;
          border-radius: 12px 12px 0 0;
        }
        .fliqlo-flip-front {
          backface-visibility: hidden;
        }
        .fliqlo-flip-back {
          transform: rotateX(180deg);
          backface-visibility: hidden;
        }
        .fliqlo-flip-card {
          transform-origin: bottom;
        }
        @keyframes fliqlo-flip {
          0% { transform: rotateX(0deg);}
          100% { transform: rotateX(-180deg);}
        }
        .fliqlo-colon {
          font-size: 5.5rem;
          color: #fff;
          margin: 0 0.7rem;
          user-select: none;
          font-family: 'Droid Sans Mono', 'monospace';
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

// Pomodoro Timer with Fullscreen and Controls
const POMODORO_DURATION = 25 * 60; // seconds

const FliqloPomodoro = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(POMODORO_DURATION);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    if (secondsLeft <= 0) {
      setIsRunning(false);
      return;
    }
    const interval = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const handlePause = () => setIsRunning(false);
  const handleResume = () => setIsRunning(true);
  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(POMODORO_DURATION);
  };

  const handleFullscreen = () => setFullscreen(true);
  const handleExitFullscreen = () => setFullscreen(false);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const Controls = () => (
    <div style={{ marginTop: 32 }}>
      {isRunning ? (
        <button onClick={handlePause} className="fliqlo-btn">Pause</button>
      ) : (
        <button onClick={handleResume} className="fliqlo-btn" disabled={secondsLeft <= 0}>Start</button>
      )}
      <button onClick={handleReset} className="fliqlo-btn" style={{ marginLeft: 16 }}>Reset</button>
    </div>
  );

  return (
    <>
      {/* Main View */}
      <div style={{ textAlign: 'center', marginTop: 60 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <button onClick={handleFullscreen} title="Fullscreen" className="fliqlo-btn-icon">
            <Maximize2 size={28} />
          </button>
        </div>
        <FliqloFlipClock minutes={minutes} seconds={seconds} />
        <Controls />
      </div>

      {/* Fullscreen Modal */}
      {fullscreen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10,10,15,0.98)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <button
            onClick={handleExitFullscreen}
            title="Exit Fullscreen"
            className="fliqlo-btn-icon"
            style={{ position: 'absolute', top: 32, right: 32 }}
          >
            <Minimize2 size={36} />
          </button>
          <FliqloFlipClock minutes={minutes} seconds={seconds} />
          <Controls />
        </div>
      )}
      <style>{`
        .fliqlo-btn {
          background: #23232b;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.7em 2em;
          font-size: 1.2rem;
          font-family: inherit;
          font-weight: 600;
          margin-top: 1.5rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .fliqlo-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .fliqlo-btn:hover:not(:disabled) {
          background: #44445a;
        }
        .fliqlo-btn-icon {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 0.2em;
          border-radius: 6px;
          transition: background 0.2s;
        }
        .fliqlo-btn-icon:hover {
          background: #23232b;
        }
      `}</style>
    </>
  );
};

// Remove FlipClock and related exports
// Only export FliqloPomodoro as default
export default FliqloPomodoro; 