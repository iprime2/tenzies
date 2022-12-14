import './App.css';
import Die from './components/die'
import React from 'react';
import {nanoid} from 'nanoid'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import { useStopwatch } from 'react-timer-hook'

function App() {
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

  const [firstValue, setFirstValue] = React.useState(0)
  const [duplicate, setDuplicate] = React.useState(true)

  const [userStats, setUserStats] = React.useState(
    () => JSON.parse(localStorage.getItem("userStats")) || []
  )
  
  const [currentUserId, setCurrentUserID] = React.useState(
    (userStats[0] && userStats[0].id) || ""
  )

  const [userName, setUsername] = React.useState("None")

  const[isNewuser, setIsNewuser] = React.useState(false)
  const { width, height } = useWindowSize()
  const [dice, setDice] = React.useState(allNewDice())
  const [noRoll, setNoRoll] = React.useState(0)
  const [tenzies, setTenzies] = React.useState(false)
  const allHeld = dice.every(die => die.isHeld)
  const allSameValue = dice.every(die => die.value === firstValue )
  
  React.useEffect(() =>{
    localStorage.setItem("useStats", JSON.stringify(...userStats,userStats))
    
  }, [userStats])

  function createUser(){
    const Newuser = {
      id:nanoid(),
      name:"",
      totalRoll:0,
      second:0,
      minute:0
    }
    setUserStats(oldUser => [...oldUser, Newuser])
    setCurrentUserID(Newuser.id)
    setIsNewuser(true)
  }

  function updateUsername(event){
    const {value} = event.target
    setUsername(value) 
  }

  /*##################################################*/

  React.useEffect(() => {
    const firstValue = dice[0].value
    if (allHeld && allSameValue){
      setTenzies(true) 
      setUserStats(oldValues => {
        const newArray = []
        for (let i=0; i<oldValues.length; i++){
          const oldValue = oldValues[i]
          if(oldValue.id === currentUserId){
            newArray.unshift({
              ...oldValue,
              name:userName,
              totalRoll:noRoll,
              second:seconds,
              minute:minutes})
            }else{
              newArray.push(oldValue)
            }
          }
          return newArray
        })
    }    
  }, [dice]) 

  function generateNewDie(){
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice(){
    const newDice = []
    for(let i=0; i<10; i++){
      newDice.push(generateNewDie())
    } 
    return newDice
  }

  function rollDice(id){
    if(!tenzies){
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ?
          die : generateNewDie()
      }))
      setNoRoll(oldCount => oldCount + 1)
    }else{
      setTenzies(false)
      setDice(allNewDice)
      setNoRoll(0) 
      setIsNewuser(false)
    }
    
  }

  function holdDice(id, value) {
    if (noRoll < 1 && duplicate){
      setFirstValue(value)
      setDuplicate(false)
    }

    if (noRoll > 0){
      if(value !== firstValue)
        alert("Please choose different Dice")
      setDice(oldDice => oldDice.map(die => {
        return die.id === id && !die.isHeld && die.value === firstValue? 
            {...die, isHeld: !die.isHeld} :
            {...die}
      }))
    }else if (noRoll === 0){
      if (!duplicate)
        if(value !== firstValue)
          alert("Please choose different Dice")
      setDice(oldDice => oldDice.map(die => {
        return die.id === id 
          ? {...die,
              isHeld: !duplicate 
                  ? die.value === firstValue 
                    ? !die.isHeld
                    : die.isHeld
                  : !die.isHeld}
          : {...die}
      }))
    }
  }

  console.log(dice)

  /*const [time, setTime] = React.useState({
    id:"",
    second:"0",
    minutes:"0"
  })

  function recordTime(sec, min){
    console.log('inside record time')
    setTime({
      id:dice.id,
      second:seconds,
      minutes:minutes
    })
  }*/

  const diceElements = dice.map(die => (
    <Die 
        key={die.id} 
        id={die.id}
        value={die.value} 
        isHeld={die.isHeld} 
        holdDice={holdDice}
    />
  ))

  const score = userStats.map(items => (
    <p className='final-text'>
      {items.name && `${items.name} has rolled dice ${items.totalRoll} in ${items.minute}:${items.second} time`}
    </p>
  ))

  return (
    <div className="App">
          { tenzies && <Confetti
                        width={width}
                        height={height}
                  />}
          <main>
            <section className='text'>
              <h1 className="title">Tenzies</h1>
              <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            </section>
            {/* starting the game  */}
            {
              isNewuser ?
                <div>
                  <div className='dice-container'>
                    {diceElements}
                  </div>
                  <div className='stats'>
                    <p className='time'>Time : {minutes}:{seconds}</p>
                    <p className='no-diceroll'>Number of times dice rolled : {noRoll}</p>
                    {tenzies && <div className='game-won'>Congrats, You won the game</div> }
                  </div>
                  <button className='roll-dice' onClick={rollDice}>
                    {tenzies ? "New Game" : "Roll"}</button>
                  {/*<button onClick={update} className="roll-dice newuser-btn">Update</button>*/}
                  <section className='score-section'>
                    {score}
                  </section>
                </div>
              :
              
                  <div className='welcome-main'>
                    <h2 className='welcome-text'>Welcome to the game!</h2>
                    <input className='input-username' 
                          type="text"
                          placeholder='Enter your name'
                          name='username'
                          value={userStats.name}
                          onChange={updateUsername} />
                    <br />
                    <button onClick={createUser} className="roll-dice newuser-btn">Start</button>
                    
                  </div>
            }
          </main>

      {/*
      <MyTime 
        setTime={setTime}
        recordTime={recordTime}/>
      */}


    </div>
  );
}

export default App;
