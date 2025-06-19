import React, { useState, useEffect } from 'react';
import '../css/stopwatch.css';
import { FaLongArrowAltRight } from "react-icons/fa";

const Stopwatch = () => {
    const [time, setTime] = useState({ ms: 0, s: 0, m: 0, h: 0 });
    const [timer, setTimer] = useState(null);
    const [laps, setLaps] = useState([]);

    useEffect(() => {
        return () => { 
            if (timer) clearInterval(timer);
        };
    }, [timer]);

    const start = () => {
        if (!timer) {
            setTimer(setInterval(run, 10));
        }
    };

    const run = () => {
        setTime(prevTime => {
            let { ms, s, m, h } = prevTime;
            ms++;
            if (ms === 100) {
                ms = 0;
                s++;
            }
            if (s === 60) {
                s = 0;
                m++;
            }
            if (m === 60) {
                m = 0;
                h++;
            }
            if (h === 13) {
                h = 1;
            }
            return { ms, s, m, h };
        });
    };

    const pause = () => {
        clearInterval(timer);
        setTimer(null);
    };

    const reset = () => {
        clearInterval(timer);
        setTimer(null);
        setTime({ ms: 0, s: 0, m: 0, h: 0 });
    };

    const restart = () => {
        reset();
        start();
    };

    const lap = () => {
        if (timer) {
            setLaps(prevLaps => [...prevLaps, getTimer()]);
        }
    };

    const resetLap = () => {
        setLaps([]);
    };

    const getTimer = () => {
        const { h, m, s, ms } = time;
        return `${h < 10 ? "0" + h : h} : ${m < 10 ? "0" + m : m} : ${s < 10 ? "0" + s : s} : ${ms < 10 ? "0" + ms : ms}`;
    };

    return (
        <div className="watch-container">
            <div className="timer-Display">
                {getTimer()}
            </div>

            <div className="buttons">
                <button id="startTimer" onClick={start}>Start</button>
                <button id="pauseTimer" onClick={pause}>Pause</button>
                <button id="resetTime" onClick={reset}>Reset</button>
                <button id="restartTimer" onClick={restart}>Restart</button>
                <button id="lap" onClick={lap}>Lap</button>
                <button id="resetLap" onClick={resetLap}>Reset Laps</button>
            </div>

            <ul className="laps">
                {laps.map((lap, index) => (
                    <li key={index}>Lap{index+1} <FaLongArrowAltRight /> {lap}</li>
                ))}
            </ul>
        </div>
    );
};

export default Stopwatch;