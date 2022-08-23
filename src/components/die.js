import React from "react";

export default function Die(props){
    const styles = {
        backgroundColor : props.isHeld ? "#59e391" : "white"
    }
    return(
        
        <div 
            className="die-face" 
            style={styles}  
            onClick={props.holdDice}>
            <img src={`/images/dice-${props.value}.png `} alt="dice" className="dice-img"/>
        </div>
    )
}