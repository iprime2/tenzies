import React from 'react'
import { useStopwatch } from 'react-timer-hook'

export default function MyTime({recordTime}) {  
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  }= useStopwatch({ autoStart: true });

      return (
        <div style={{textAlign: 'center'}}>
          <h1>react-timer-hook</h1>
          <p>Stopwatch Demo</p>
          <div style={{fontSize: '100px'}}>
            <span>{days}</span>:
            <span>{hours}</span>:
            <span>{minutes}</span>:
            <span contentEditable={true}
              onChange={() => recordTime(seconds, minutes)}>{seconds}</span>
          </div>
          <p>{isRunning ? 'Running' : 'Not running'}</p>
          <button onClick={start}>Start</button>
          <button onClick={pause}>Pause</button>
          <button onClick={reset}>Reset</button>
        </div>
      )
}