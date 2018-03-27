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
const CANT_ARMAS = 4; // del jugador
const CANT_PAREDES = 15;
//const SIZE_WALL = 3; // cantidad máxima de celdas de una pared.
const POS_INICIO_JUGADOR = { row: 0, col: 0};
const FOOD_ENERGY = 10;
// const MONSTER_POWER = 50;
const MONSTER_ENERGY = 50;
const MONSTER_LEVEL = 1;
const BOSS_LEVEL = 5;
const BOSS_ENERGY = 80;
const ARMAS_JUGADOR = {"estrella": 10, "libro": 20};
const ARMAS_MONSTRUOS = {"martillo": 5, "aguja": 1};
// 
// const MONSTRUO = {energia: MONSTER_POWER, arma: "martillo", nivel: 1}; // por ahora queda así.
//
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
  addItemToMap(mapa, {type:"salida"}, pos);
}

function addMonsterToMap(mapa, pos) {
  // Elegir un número al azar entre 1 y 4 para definir el nivel de los monstruos
  // Por ahora, van a tener todos nivel 1.
  addItemToMap(mapa, {type: "monster", energia: MONSTER_ENERGY, arma: "aguja", nivel: MONSTER_LEVEL}, pos);
}

function addMonsterBossToMap(mapa, pos) {
  addItemToMap(mapa, {type: "boss", energia: BOSS_ENERGY, arma: "martillo", nivel: BOSS_LEVEL}, pos);
}

function addWallToMap(mapa, pos){
 addItemToMap(mapa, {type:"wall"}, pos);
}

// Pensar cómo reescribir addWeaponToMap y addFoodToMap porque son muy similares, se podría usar una genérica con ciertos parámetros.
function addWeaponToMap(mapa, pos){
  const armas = Object.keys(ARMAS_JUGADOR); // array de keys de ARMAS
  const typeOfWeapon = armas[randomPositiveIntegerFromMinToMax(0, armas.length)];
  addItemToMap(mapa, {"type": typeOfWeapon}, pos); // por ahí acá hay un bug. ver qué es typeOfWeapon
}

function addFoodToMap(mapa, pos){
  // Para ofrecer varios tipos de comida:
  // const comida = Object.keys(FOOD);
  // const typeOfFood = comida[randomPositiveIntegerFromMinToMax(0, comida.length)];
  // addItemToMap(mapa, {"type": typeOfFood}, pos);
  addItemToMap(mapa, {"type": "food"}, pos);
}

function addItemToMap(mapa, item, pos) {
  mapa[pos.row][pos.col] = item;
}

function randomPositiveIntegerFromMinToMax(min, max) {
  // https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Math/random
  return Math.floor(Math.random() * (max - min) + min); 
}

/*
function lanzarMoneda() {
  // Devuelve 0 o 1, al azar.
  return randomPositiveIntegerFromMinToMax(0, 2); // usar la general y pasarle 0 y 2 como argumentos
}
*/


class Juego extends React.Component {
  constructor(){
    super();
    this.state = {
      jugador: {pos: POS_INICIO_JUGADOR},
      puntos: 0,
      energia: 50,
      arma: "estrella",
      nivelJugador: 1,
      mapa: MAPA,
      ancho: COLUMNAS * ANCHO_COL,
      alto: FILAS * ALTURA_FILA,
      darkOn: true,
      bossCaptured: false,
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
    // Antes de querer acceder a type en cada una de estas funciones, veo si pos es null
    const celda = this.getCellObj(pos);
    // console.log(celda);
    if(celda){
      if (this.isFood(pos)){
        this.eatFood(pos);
      } else if (this.isMonster(pos) || this.isTheBoss(pos)) {
        this.fightMonster(pos);
      } else if (this.isWeapon(pos)) {
        this.takeWeapon(pos);
      } else if (this.isTheExit(pos)){
        this.moveTo(pos);
      }      
    } else {
      // la celda contiene null, está vacía, se puede ocupar
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

  attack(player, monster){
    // player y monster son de la forma: {energia: Number, arma: String, nivel: Number}
    // Devuelve un "player" o "monster" según quién haya ganado el ataque.
    
    // usar random y algo más para que las probabilidades se ajusten al power de cada uno. 
    // Provisoriamente:
    const playerPower = (player.energia + ARMAS_JUGADOR[player.arma] + player.nivel) * Math.random();
    const monsterPower = (monster.energia + ARMAS_MONSTRUOS[monster.arma] + monster.nivel) * Math.random();
    console.log("Player power: " + playerPower);
    console.log("Monster power: " + monsterPower);
    console.log("Monster energy: " + monster.energia);
    // acá veo cuál gana.

    // por ahora, y va a cambiar porque no tiene que ser así:
    return (playerPower > monsterPower)? "player" : "monster";
  }

  // Más adelante adecuar el enfrentamiento a las especificaciones. Ver user stories.

  fightMonster(pos){
    // TO DO
    // provisorio.
    // falta implementar que el jugador gane puntos de experiencia y con eso pueda ir subiendo su nivel.

    const playerState = {energia: this.state.energia, arma: this.state.arma, nivel: this.state.nivelJugador};
    const monsterState = this.getCellObj(pos); // el monstruo de la posición actual pos
    console.error("Energía del monstruo: " + monsterState.energia);
    // acá se va a calcular quién recibe el daño.
    // al que le toca perder se le reduce su energía.
    // si el monstruo se queda sin energía, desaparece del mapa, y el jugador gana experiencia
    // si acumula cierta cantidad de puntos de experiencia suma uno a su nivel, y el conteo de experiencia para llegar al próximo nivel puede ponerse a 0 o seguir acumulándose.

    // La función podría devolver "monster" o "player", según quién ganó el ataque.
    // entonces si ganó player, tal cosa, else, tal otra.

    const winner = this.attack(playerState, monsterState);

    if (winner === "player"){
      this.reduceMonsterEnergy(pos, 5); // por ahora queda así
    } else {
      // restar puntos al jugador
      this.reduceEnergy(5); // por ahora queda así
    }

    if (monsterState.energia <= 0) {  
      if(this.isTheBoss(pos)){
        // esto primero porque si no, no detecta nunca que es el boss porque parece que lo saca del mapa y mueve al jugador entonces la posición es otra...
        this.setState({bossCaptured: true});
      }

      // Esto debería suceder si el monstruo perdió toda su energía. Es decir si el jugador venció al monstruo.
      this.removeFromMap(pos);
      // this.addPoints(enemyPower); // acá debería indicarse agregar puntos de experiencia al jugador
      this.moveTo(pos);
      // ¿Cómo lo puedo escribir mejor?
    }

    // ¿acá tengo que chequear si es el monster boss y actualizar el estado de bossCaptured?

  }

  reduceEnergy(amount) {
    this.addEnergy((-amount));
  }

  reduceMonsterEnergy(pos, amount) {
    const mapa = copyBoard(this.state.mapa);
    mapa[pos.row][pos.col].energia -= amount;
    this.setState({mapa: mapa});
    return
  }

  takeWeapon(pos) {
    const arma = this.getCellObjType(pos);
    console.error("Tipo de arma: " + arma);
    this.setState({arma: arma});
    this.removeFromMap(pos);
    this.addPoints(ARMAS_JUGADOR[arma]);
    this.moveTo(pos);
  }

  isOnTheMap(pos) {
    if ( 0 <= pos.row && pos.row < this.state.mapa.length && 0 <= pos.col && pos.col < this.state.mapa[0].length) {
      return true;  
    }
    return false;
  }

  // ¿Es necesaria isEmptySpace()? Me parece que no
  /* isEmptySpace(pos) {
    return !ocupada(this.state.mapa, pos); // función fuera de la clase.
  }
  */

  isFood(pos) {
    return this.getCellObjType(pos) === "food";
  }

  isWeapon(pos) {
    return ( this.getCellObjType(pos) === "estrella" 
      || this.getCellObjType(pos) === "libro");
  }

  isTheBoss(pos) {
    return this.getCellObjType(pos) === "boss";         
  }

  isMonster(pos) {
    return this.getCellObjType(pos) === "monster";
  }

  isLevelCompleted(){
    // Criterio actual, provisorio: se termina el nivel si el jugador no tiene más energía o si llegó a la celda marcada como salida. ¿Qué pasa si no puede porque está encerrada por paredes o el mismo jugador está encerrado? Por ahora, volver a cargar la página para generar otro mapa.
    // Agregar el criterio de que tiene que haber vencido al monstruo jefe.
    let res = (this.isTheExit(this.state.jugador.pos) && this.state.bossCaptured) || this.state.energia <= 0;
    return res;
  }

  getCellObj(pos) {
    const row = pos.row;
    const col = pos.col;
    return this.state.mapa[row][col];
  }

  getCellObjType(pos){
    const obj = this.getCellObj(pos);
    return (obj)? obj.type : null;
  }

  isTheExit(pos) {
    return this.getCellObjType(pos) === "salida";
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

/* Copia profunda de un array de arrays de objetos */
// Hacer que se copien profundamente los objetos también
/* 
Ojo con Object.assign() porque

``For deep cloning, we need to use other alternatives because Object.assign()
copies property values. If the source value is a reference to an object,
it only copies that reference value.´´(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

Igual, en este caso los valores de las propiedades son números o cadenas, que se pasan por copia y no por referencia.
*/

function copyBoard(board){
  let copy = [];
  for (let r = 0; r < board.length; r++){
     copy.push(copyRow(board,r,board[0].length));
  }
  return copy;
}

function copyRow(board, r, cols) {
  let row = [];
    for (let c = 0; c < cols; c++) {
      const contenido = board[r][c];
      const obj = (contenido) ? Object.assign({}, contenido) : null; // acá el problema se da cuando quiere copiar una cadena
      // Hay un problema cuando board[r][c] es null, en ese caso obj va a ser {} y no null, y entonces los métodos y funciones que cuentan con que haya null o un objeto no vacío fallan
      // porque Boolean(null) es false pero ¡Boolean({}) es true!.
      // se me ocurre que podría chequear acá si obj es {} y en ese caso devolver null o cambiar en otro lado, pero si cambio acá me parece más sencillo y mantiene la interfaz de devolver null cuando había null
      /* O chequeo antes la celda es de tipo objeto o hago que todo lo que va en el mapa sea por lo menos de tipo {type: algúnValor} */
      
      row.push(obj);
    }  
  return row;
}