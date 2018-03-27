import React from 'react';

function TableroPuntaje(props) {
  return (
    <div id="score">
      <p>XP: {props.xp} - Player Level: {props.nivelJugador} - Energy: {props.energia} - Current weapon: {props.arma}</p>
    </div>
  )
}

export default TableroPuntaje;