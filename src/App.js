import './App.css';
import Die from './components/die'
import React from 'react';
import {nanoid} from 'nanoid'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import MyTime from './components/MyTime'
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

  const [userStats, setUserStats] = React.useState(
    () => JSON.parse(localStorage.getItem("userStats")) || []
  )
  
  const [currentUserId, setCurrentUserID] = React.useState(
    (userStats[0] && userStats[0].id) || ""
  )

  const[isNewuser, setIsNewuser] = React.useState(false)

  const { width, height } = useWindowSize()
  const [dice, setDice] = React.useState(allNewDice())
  const [noRoll, setNoRoll] = React.useState(0)
  const [tenzies, setTenzies] = React.useState(false)
  
  React.useEffect(() =>{
    localStorage.setItem("useState", JSON.stringify(userStats))
  },[userStats])

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
    const {name, value, type} = event.target
    setUserStats(olduser => {
      return olduser.map(item => {
        return item.id === currentUserId ? 
        {
          ...olduser,
          name:value
        }: {...olduser}
      })
      /*return{
        ...olduser,
        id:nanoid(),
        name:value,
        totalRoll:0,
        second:0,
        minute:0

      }*/
    }) 
  }

  /*React.useEffect(() => {
    setUserStats(oldValues => {
      return oldValues.map((item) => {
        return item.id === userStats.id ?
        {
          ...oldValues,
          totalRoll:noRoll,
          second:seconds,
          minute:minutes
        } :
          {...oldValues}
      })
    })
  },[isNewuser])*/

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue )
    if (allHeld && allSameValue){
      setTenzies(true)
      
      setUserStats(oldValues => {
        return oldValues.map(item => {
          return item.id === currentUserId ?
          {
            ...oldValues,
            totalRoll:noRoll,
            second:seconds,
            minute:minutes
          } :
            {...oldValues}
        })
      })
      /*setUserStats(oldValues => {
        return {...oldValues,
        totalRoll:noRoll,
        second:seconds,
        minute:minutes}
      })*/
    }
    console.log(userStats)
    
  }, [dice])  

  function generateNewDie(){
    return {
      value: 4/*Math.ceil(Math.random() * 6)*/,
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

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? 
          {...die, isHeld: !die.isHeld} :
          die
    }))
  }

  

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
        value={die.value} 
        isHeld={die.isHeld} 
        holdDice={() => holdDice(die.id)}
    />
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
                  <section>
                    <p>{userStats.name} has rolled dice {userStats.totalRoll} in {userStats.minute}:{userStats.second} time
                    </p>
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
