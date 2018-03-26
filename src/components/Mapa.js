import React from 'react';


// Mejorar...
const IMAGES = {
  "food": "assets/food-carrot-300px.png",
  "monster": "assets/molumen-small-funny-angry-monster-300px.png",
  "estrella": "assets/verdastelo.png",
  "libro": "assets/green-book-300px.png",
  "boss": "assets/monster_01_purple-300px.png",
}

const ALTURA_FILA = 40;
const ANCHO_COL = 40;


function Jugador(props) {
  const newPos = setPosStyle(props.jugadorPos)
  return (
  <img
    src="assets/wind-mage-f-300px.png" 
    className="player" 
    id="wind-mage"
    style={newPos}
    alt=""
  />
  )
}

function Monster(props) {
  const posStyle = setPosStyle(props.monsterPos);
  return (
    <img style={posStyle} src={props.image} className="monster" alt=""/>
  )
}

function Comida(props) {
  const posStyle = setPosStyle(props.foodPos);
  return (
    <img style={posStyle} src={IMAGES.food} className="comida" alt="" />
    )
}

function Estrella(props) {
  const posStyle = setPosStyle(props.weaponPos);
  return (
    <img style={posStyle} src={IMAGES.estrella} className="weapon" alt="" />
    )
}

function Libro(props) {
  const posStyle = setPosStyle(props.weaponPos);
  return (
    <img style={posStyle} src={IMAGES.libro} className="weapon" alt="" />
    )
}

function Pared(props) {
  const posStyle = setPosStyle(props.wallPos);
  return (<div style={posStyle} className="wall"></div>);
}

function Salida(props) {
  const posStyle = setPosStyle(props.exitPos);
  return (
    <img style={posStyle} src="assets/trak2_warn2b.png" className="salida" alt="" />
    )
}

function setPosStyle(pos){
  const top = pos.row * ALTURA_FILA;
  const left = pos.col * ANCHO_COL;
  return {top: top, left: left}
}

function Darkness(props) {
  const newPos = setPosStyle(props.darkPos)  
  return <div style={newPos} className="dark"></div>
}

function Mapa(props) {
  const width = props.ancho + "px";
  const height = props.alto + "px";
  const style = {width: width , height: height };
  // ¿Conviene darles id a cada monstruo, cada comida, etc?
  return (
    <div className="map" style={style}>
      <Jugador jugadorPos={props.jugadorPos} />
        {props.mapa.map((fila, i) => 
          {
            return ( fila.map( (col, j) => {
              const currentCellPos = {row: i, col: j}
              if (props.darkOn){
                if(esPosAlrededor(i,j, props.jugadorPos)){
                  return iluminarCelda(col, currentCellPos);
                } else {
                  return oscurecerCelda(currentCellPos);
                }
              } else {
                // Oscuridad desactivada
                return iluminarCelda(col, currentCellPos);
              }
            }))
          }) 
        }
    </div>
  )
}

function oscurecerCelda(cellPos){
  return <Darkness darkPos={cellPos}/>
}

function iluminarCelda(col, cellPos) {
  if ( col === "monster") {
    return (<Monster image={IMAGES.monster} monsterPos={cellPos} />)
  } else if ( col === "boss") {
    return (<Monster image={IMAGES.boss} monsterPos={cellPos} />)
  } else if ( col === "food") {
    return (<Comida foodPos={cellPos} />)
  } else if ( col === "estrella") {
    return (<Estrella weaponPos={cellPos} />)
  } else if ( col === "libro") {
    return (<Libro weaponPos={cellPos} />)
  } else if ( col === "wall") {
    return (<Pared wallPos={cellPos} />)
  } else if ( col === "salida") {
    return (<Salida exitPos={cellPos} />)
  }
  return
}

function esPosAlrededor(row, col, posJugador){
  return (
    esLaMisma(row, col, posJugador) 
    || esLaDeAbajo(row, col, posJugador) 
    || esLaDeArriba(row, col, posJugador) 
    || esLaDeLaDer(row, col, posJugador)
    || esLaDeLaIzq(row, col, posJugador) 
    || esLaDeArribaIzq(row, col, posJugador) 
    || esLaDeArribaDer(row, col, posJugador) 
    || esLaDeAbajoIzq(row, col, posJugador) 
    || esLaDeAbajoDer(row, col, posJugador)
    );
}

  function esLaDeArribaIzq(row, col, pos){
    return (row === pos.row -1 && col === pos.col - 1);
  }
  function esLaDeArriba(row, col, pos) {
    return (row === pos.row -1 && col === pos.col);
  }
  
  function esLaMisma(row, col, pos) {
    return (row === pos.row && col === pos.col);
  }

  function esLaDeArribaDer(row, col, pos) {
    return (row === pos.row - 1 && col === pos.col + 1);
  }

  function esLaDeLaDer(row, col, pos) {
    return (row === pos.row && col === pos.col + 1);
  }

  function esLaDeAbajo(row, col, pos) {
    return (row === pos.row + 1 && col === pos.col);
  }
  
  function esLaDeAbajoIzq(row, col, pos) {
    return (row === pos.row + 1 && col === pos.col - 1);
  }

  function esLaDeAbajoDer(row, col, pos) {
    return (row === pos.row + 1 && col === pos.col + 1);
  }
  
  function esLaDeLaIzq(row, col, pos){
    return (row === pos.row && col === pos.col - 1);   
  }  

export default Mapa;