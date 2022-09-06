import React from "react";

export default function Die(props){
    const styles = {
        backgroundColor : props.isHeld ? "#59e391" : "white"
    }
    return(
        
        <div 
            className={`dice-face ${props.isSelected ? "selected": ""}`}
            style={styles}  
            onClick={() => props.holdDice(props.id, props.value)}>
            <img src={`/images/dice-${props.value}.png `} alt="dice" className="dice-img"/>
        </div>
    )
}