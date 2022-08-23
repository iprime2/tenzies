import './App.css';
import Die from './components/die'
import React from 'react';
import {nanoid} from 'nanoid'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import MyTime from './components/MyTime'

function App() {
  const { width, height } = useWindowSize()
  const [dice, setDice] = React.useState(allNewDice())
  const [noRoll, setNoRoll] = React.useState(0)
  const [tenzies, setTenzies] = React.useState(false)
  

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue )
    if (allHeld && allSameValue){
      setTenzies(true)
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
    }
    
  }

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? 
          {...die, isHeld: !die.isHeld} :
          die
    }))
  }

  const [time, setTime] = React.useState({
    id:"",
    second:"0",
    minutes:"0"
  })

  function recordTime(event, sec, min){
    console.log('inside record time')
    setTime({
      id:dice.id,
      second:sec,
      minutes:min
    })
  }

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
      <main>
        <section className='text'>
          <h1 className="title">Tenzies</h1>
          <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        </section>
        <div className='dice-container'>
          {diceElements}
        </div>
        <p>{time.second}</p>
        <p>{tenzies ? "Total":"" } Number of dice rolled : {noRoll}</p>
        {tenzies && <div className='game-won'>Congrats, You won the game</div> }
        { tenzies && <Confetti
                      width={width}
                      height={height}
                />}
        <button className='roll-dice' onClick={rollDice}>
          {tenzies ? "New Game" : "Roll"}</button>
        
      </main>

      <MyTime 
        setTime={setTime}
        recordTime={recordTime}/>


    </div>
  );
}

export default App;
