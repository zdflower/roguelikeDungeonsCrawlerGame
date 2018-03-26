import React from 'react';

import Instrucciones from './Instrucciones.js';
import Mapa from './Mapa';
import GameEnd from './GameEnd';
import TableroPuntaje from './TableroPuntaje';

// Generador de Nivel:
const FILAS = 10;
const COLUMNAS = 15;
const ALTURA_FILA = 40;
const ANCHO_COL = 40;
const CANT_SALIDAS = 1;
const CANT_BOSS = 1;
const CANT_MONSTRUOS = 10;
const CANT_COMIDA = 8;
const CANT_ARMAS = 2; 
const CANT_PAREDES = 15;
//const SIZE_WALL = 3; // cantidad máxima de celdas de una pared.
const POS_INICIO_JUGADOR = { row: 0, col: 0};
const FOOD_ENERGY = 10;
const MONSTER_POWER = 10;
const BOSS_POWER = 20;
const ARMAS = {"estrella": 10, "libro": 20};

let posiciones_disponibles = FILAS * COLUMNAS;

const MAPA = createMapa(FILAS, COLUMNAS);

function createMapa(filas, columnas) {
  const mapa = inicializarMapa(filas, columnas);
  agregarSalida(mapa, filas, columnas);
  agregarParedAlMapa(mapa, filas, columnas);
  agregarMonsterBoss(mapa, filas, columnas);
  agregarMonstruosAlMapa(mapa, filas, columnas);        
  agregarComidaAlMapa(mapa, filas, columnas);
  agregarArmasAlMapa(mapa, filas, columnas);
  return mapa;
}

function agregarMonsterBoss(mapa, filas, columnas){
  agregarItemsAlMapa(mapa, filas, columnas, CANT_BOSS, addMonsterBossToMap);
}

function agregarSalida(mapa, filas, columnas) {
  agregarItemsAlMapa(mapa, filas, columnas, CANT_SALIDAS, addExitToMap);
}

function agregarMonstruosAlMapa(mapa, filas, columnas) {
  agregarItemsAlMapa(mapa, filas, columnas, CANT_MONSTRUOS, addMonsterToMap);        
}

function agregarComidaAlMapa(mapa, filas, columnas) {
  agregarItemsAlMapa(mapa, filas, columnas, CANT_COMIDA, addFoodToMap);
}

function agregarArmasAlMapa(mapa, filas, columnas) {
  agregarItemsAlMapa(mapa, filas, columnas, CANT_ARMAS, addWeaponToMap);
}

function hayPosicionesDisponibles(){
  return posiciones_disponibles > 0;
}

function elegirPosDisponibleSiSePuede(mapa, filas, columnas){
    // Obtener una posición desocupada si hay lugar y devolverla 
    // o null si no se puede.
    let pos = choosePos(filas, columnas);
    let okToFill = isOkToFill(mapa, pos);
    let hayPosiciones = hayPosicionesDisponibles();
    
    while(hayPosiciones && !okToFill) {
      pos = choosePos(filas, columnas);
      okToFill = isOkToFill(mapa, pos);
      hayPosiciones = hayPosicionesDisponibles();
    }

    // Si hay una posición válida
    if (okToFill && hayPosiciones){
      return pos;  
    }
    // si no
    return null;
  }

function agregarItemsAlMapa(mapa, filas, columnas, cantItems, adderFn){
  for (let i = 0; i < cantItems; i++) {
    const pos = elegirPosDisponibleSiSePuede(mapa, filas, columnas);
    if (pos) {
      adderFn(mapa, pos);
      posiciones_disponibles--;
    }
  }
}

function isOkToFill(mapa, pos){
  return !ocupada(mapa, pos) && !(pos.row === POS_INICIO_JUGADOR.row && pos.col === POS_INICIO_JUGADOR.col) && isOnTheMap(mapa, pos);
}

// Similar al método de la clase juego. Ver cómo se puede mejorar.
function isOnTheMap(mapa, pos) {
    if ( 0 <= pos.row && pos.row < mapa.length && 0 <= pos.col && pos.col < mapa[0].length) {
      return true;  
    }
    return false;
  }

function agregarParedAlMapa(mapa, filas, columnas) {
  // TO DO: Revisar y reescribir. Por ahora está fijo que por cada pared se van a elegir 3 posiciones.

  for (let i = 0; i < CANT_PAREDES; i++) {
    const pos_1 = choosePos(filas, columnas); // elegir la del medio
    if (isOkToFill(mapa, pos_1)) addWallToMap(mapa, pos_1);
    const pos_0 = {row: pos_1.row, col: pos_1.col - 1}; // veo si la de la izquierda se puede ocupar
    if (isOkToFill(mapa, pos_0)) addWallToMap(mapa, pos_0);
    const pos_2 = {row: pos_1.row, col: pos_1.col + 1}; // veo si la de la derecha se puede ocupar
    if (isOkToFill(mapa, pos_2)) addWallToMap(mapa, pos_2);
  }
}

// SERÍA MEJOR tener siempre a mano una función genérica que devuelva enteros positivos al azar entre dos límites.

function lanzarMoneda() {
  // Devuelve 0 o 1, al azar.
  return Math.floor(Math.random() * 2); 
}

function addWeaponToMap(mapa, pos){
  const armas = Object.keys(ARMAS); // array de keys de ARMAS
  const typeOfWeapon = armas[lanzarMoneda()]; // SUPONIENDO que SIEMPRE van a haber DOS tipos de arma.
  addItemToMap(mapa, typeOfWeapon, pos);
}

function ocupada(mapa, pos) {
  // Se va a considerar desocupada si en mapa[pos.row][pos.col] hay null
  return Boolean(mapa[pos.row][pos.col]); // null castea a false, y una cadena no vacía castea a true
}

function inicializarMapa(filas, columnas) {
  const mapa = [];
  for (let f = 0; f < filas; f++) {
    mapa.push(inicializarFila(columnas))
  }
  return mapa;
}

function inicializarFila(columnas) {
  const fila = [];
  for (let c= 0; c < columnas; c++) {
    fila.push(null);
  }
  return fila;
}

function choosePos(max_rows, max_cols){
  // Beau teaches Javascript - Random numbers & parseint on Youtube
  
  // elegir de 0 a max_rows - 1 una fila
  // elegir de 0 a max_cols - 1 una columna
  // retornar {row: fila, col: columna}
  const row = Math.floor(Math.random() * max_rows);
  const col = Math.floor(Math.random() * max_cols);
  const pos = {row: row, col: col};
  return pos;  
}

function addExitToMap(mapa, pos) {
  addItemToMap(mapa, "salida", pos);
}

function addMonsterToMap(mapa, pos) {
  addItemToMap(mapa, "monster", pos);
}

function addMonsterBossToMap(mapa, pos) {
  addItemToMap(mapa, "boss", pos);
}

function addFoodToMap(mapa, pos){
  addItemToMap(mapa, "food", pos);
}

function addWallToMap(mapa, pos){
 addItemToMap(mapa, "wall", pos);
}

function addItemToMap(mapa, item, pos) {
  mapa[pos.row][pos.col] = item;
}



class Juego extends React.Component {
  constructor(){
    super();
    this.state = {
      jugador: {pos: POS_INICIO_JUGADOR},
      puntos: 0,
      energia: 50,
      arma: "estrella",
      mapa: MAPA,
      ancho: COLUMNAS * ANCHO_COL,
      alto: FILAS * ALTURA_FILA,
      darkOn: true,
    }
  }


  // A partir de la respuesta de miwst a JordanSobovitch en el foro de FreeCodeCamp (Let's discuss your "Roguelike Dungeon Crawler Game"):
  componentWillMount() {
    document.addEventListener('keypress', this.keyPressHandler.bind(this));
  }

  keyPressHandler(event) {
    let row = this.state.jugador.pos.row;
    let col = this.state.jugador.pos.col;
    
    if (event.key === "j"){
      // Mover hacia abajo.
      row++;
    } else if (event.key === "l"){
      // hacia derecha
      col++;
    } else if (event.key === "k"){
      // hacia arriba
      row--;
    } else if (event.key === "h"){
      // izquierda
      col--;
    }

    this.tryToChangePos({row: row, col: col});
  }

  tryToChangePos(pos) {
    if (this.isOnTheMap(pos)) {
      this.updateState(pos);
    }
  }

  updateState(pos) {
      if (this.isFood(pos)){
        this.eatFood(pos);
      } else if (this.isMonster(pos) || this.isTheBoss(pos)) {
        this.fightMonster(pos);
      } else if (this.isWeapon(pos)) {
        this.takeWeapon(pos);
      } else if (this.isEmptySpace(pos) || this.isTheExit(pos)){
        this.moveTo(pos);
      }
  }

  eatFood(pos) {
    this.removeFromMap(pos);
    this.addEnergy(FOOD_ENERGY);
    this.moveTo(pos);
  }

  moveTo(pos) {
    this.setState({ jugador: {pos: pos} });        
  }

  addEnergy(amount){
    this.setState({energia: this.state.energia + amount});
  }

  addPoints(amount){
    this.setState({puntos: this.state.puntos + amount});
  }        

  removeFromMap(pos) {
    const mapa = [...this.state.mapa];
    mapa[pos.row][pos.col] = null;
    this.setState({
      mapa: mapa
    })
  }

  // Más adelante adecuar el enfrentamiento a las especificaciones. Ver user stories.

  fightMonster(pos){
    // TO DO

    const enemyPower = (this.isTheBoss(pos))? BOSS_POWER : MONSTER_POWER;

    const playerAttack = Math.random();
    const monsterAttack = Math.random();
    if (playerAttack >= monsterAttack) {
      this.removeFromMap(pos);
      this.addPoints(enemyPower);
      this.moveTo(pos);
    } else {
      this.reduceEnergy(enemyPower);
    }
  }

  reduceEnergy(amount) {
    this.addEnergy((-amount));
  }

  takeWeapon(pos) {
    // TO DO
    const arma = this.state.mapa[pos.row][pos.col];
    this.setState({arma: arma});
    this.removeFromMap(pos);
    this.addPoints(ARMAS[arma]);
    this.moveTo(pos);
  }

  isOnTheMap(pos) {
    if ( 0 <= pos.row && pos.row < this.state.mapa.length && 0 <= pos.col && pos.col < this.state.mapa[0].length) {
      return true;  
    }
    return false;
  }

  // ¿Es necesaria isEmptySpace()?
  isEmptySpace(pos) {
    return !ocupada(this.state.mapa, pos); // función fuera de la clase.
  }

  isFood(pos) {
    return this.state.mapa[pos.row][pos.col] === "food";
  }

  isWeapon(pos) {
    return ( this.state.mapa[pos.row][pos.col] === "estrella" 
      || this.state.mapa[pos.row][pos.col] === "libro");
  }

  isTheBoss(pos) {
    return this.state.mapa[pos.row][pos.col] === "boss";         
  }

  isMonster(pos) {
    return this.state.mapa[pos.row][pos.col] === "monster";
  }

  isLevelCompleted(){
    // Criterio actual, provisorio: se termina el nivel si el jugador no tiene más energía o si llegó a la celda marcada como salida. ¿Qué pasa si no puede porque está encerrada por paredes o el mismo jugador está encerrado? Por ahora, volver a cargar la página para generar otro mapa.
    let res = this.isTheExit(this.state.jugador.pos) || this.state.energia <= 0;
    return res;
  }

  isTheExit(pos) {
    const row = pos.row;
    const col = pos.col;
    return this.state.mapa[row][col] === "salida";
  }

  toggleDarkOn() {
    console.log("Cambio darkOn.")
    this.setState({darkOn: !this.state.darkOn});
  }

  render() {
    // Si el nivel no está completado entonces se renderea el mapa, y si está completado se renderea un mensaje que indica que se terminó el juego.
    let fin_o_mapa = <Mapa darkOn={this.state.darkOn} mapa={this.state.mapa} ancho={this.state.ancho} alto={this.state.alto} jugadorPos={this.state.jugador.pos} />;
    if (this.isLevelCompleted()) {
      fin_o_mapa = <GameEnd message="Game finished!" />;
    }
    return (
        <div id="juego">
          <Instrucciones />
          <button className="toggleDark" onClick={this.toggleDarkOn.bind(this)}>Toggle Darkness</button>
          <TableroPuntaje 
            puntos={this.state.puntos}
            energia={this.state.energia}
            arma={this.state.arma}
          />
          {fin_o_mapa}
        </div>
      )
  }
}

export default Juego;