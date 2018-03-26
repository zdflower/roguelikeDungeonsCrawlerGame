import React from 'react';

function TableroPuntaje(props) {
  return (
    <div id="score">
      <p>Points: {props.puntos} - Energy: {props.energia} - Current weapon: {props.arma}</p>
    </div>
  )
}

export default TableroPuntaje;