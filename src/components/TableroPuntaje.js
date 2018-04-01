import React from 'react';

import IMAGES from './images.js';
/* 
  Voy a hacer que sirva tanto para el jugador como para un monstruo

  si props.xp no es null ...
  y además se va a mostrar la imagen del personaje

  o se podrían mostrar todo en el mismo...

*/

function TableroPuntaje(props) {
  // primero pido que props.monster no sea null y chequeo props.monster.type por si props.monster es un objeto vacío (lo cual se interpreta acá como true).
  let monster = (props.monster && props.monster.type)? <div><p>Monster:</p><img alt="Monster" src={IMAGES[props.monster.type]} /><p>Level: {props.monster.nivel} - Energy: {props.monster.energia} - Current weapon: {props.monster.arma}</p></div> : "";
  return (
    <div id="score">
    <div>
    <p>Player:</p>
    <img alt="Player" src={props.playerImg} />
    <p>XP: {props.xp} - Level: {props.nivelJugador} - Energy: {props.energia} - Current weapon: {props.arma}</p>
    </div>
    {monster}    
    </div>
  )
}

export default TableroPuntaje;