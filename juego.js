/* 
    Universidad: Univeridad Politécnica de sinaloa.
    Carrera: Tecnologías de la información.
    Clase: Sistemas Inteligentes.
    Profesor: Rodolfo Ostos Robles.
    Título: Juego de la vida.
    Autores: Espinoza Delgadillo Gerardo Federico
             Flores Sánchez Zinedine
             Olivas López Luis Jesús
    Fecha: 03/02/2021
*/

//LLamar canvas
const canvas = document.getElementById('canvas');
//Establecer contexto 2d de canvas
const context = canvas.getContext('2d');
//Tamaño y escala de la cuadrícula
const size = 600;
const scale = 10;
const resolution = size / scale;

//Generar los botones
const buttonStart = document.getElementById('start')
const buttonStop = document.getElementById('stop')
const buttonRandom = document.getElementById('random')
const buttonClean = document.getElementById('clean') 

let newGen = true;
let generation = 0;
let cells;
let elemLeft;
let elemTop;

//Iniciar contexto de vancas
setup();

//Obtener el valor la casilla que se ha seleccionado con el mouse
elemLeft = canvas.offsetLeft + canvas.clientLeft;
//Calcular la posición
elemTop = canvas.offsetTop + canvas.clientTop;

//Función eventListener al hacer click
canvas.addEventListener('click', function(event) {
     var x = event.pageX - elemLeft, //will get the position of the mouse by substracting the canvas position that 
        y = event.pageY - elemTop;   //we calculate to the DOM position of the mouse
        x = Math.floor(x/10) //round the number, in this case to the floor that means if 59.9 then 59 or if 59.2 then 59
        y = Math.floor(y/10)
        cells[x][y] = cells[x][y] === true ? false : true; //if the selected cell is already alive and is clicked the cell will die
        drawCells();
}, false);

//Programación del botón Iniciar
buttonStart.addEventListener('click', event => {
    newGen = true;
    buttonStop.textContent = 'Pausar'
    setInterval(newGeneration, 100);
})

//Programación del botón Pausar
buttonStop.addEventListener('click', event => {
    const paused = () => {
        buttonStop.textContent = 'Pausado'
        return false
    }
    const play = () => {
        buttonStop.textContent = 'Pausar'
        return true
    }
    newGen = (buttonStop.textContent === 'Pausar') ? paused() : play()
})

//Programación del botón Aleatorio
buttonRandom.addEventListener('click',event => {
    randomCells();
    resultsConstructor(cellsALiveCount())
    drawCells();
})

//Programación del botón Limpiar
buttonClean.addEventListener('click', event => {
    resultsConstructor(0)
    newGen = false
    cells = createCells();
    drawCells();
})

//Construir escenarios al activar los botones Aleatorio y Limpiar
function resultsConstructor(cellsAlive){
    generation = 0;
    buttonStop.textContent = 'Pausar'
    setResults(generation, cellsAlive)
}

//Validación del intervalo entre generaciones
function newGeneration(){
    newGen === true ?  step() : null
}

//Iniciar cuadrícula con un tamaño preestablecido de 60x60 cuadros
function setup(){
    canvas.width = size;
    canvas.height = size;
    context.scale(scale, scale); 
    context.fillStyle = 'yellow'; 
    cells = createCells()
}

//Creación de celdas mediante un arreglo, determina las bacterias muertas
function createCells(){
    let arr = new Array(resolution);
    for (let y = 0; y < resolution; y++){
        let cols = new Array(resolution);
        for(let x = 0; x < resolution; x++){
            cols[x] = false;
        }
        arr[y] = cols;
    }
    return arr;
}

//Programación del botón aleatorio
function randomCells(){
    for (let y = 0; y < resolution; y++){
        for (let x = 0; x < resolution; x++){
            if ( Math.random() < 0.5 ) 
                cells[y][x] = true;  
        }
    } 
}

//Colorear las bacterias en la cuadrícula
function drawCells(){
    context.fillStyle = 'gray';
    context.fillRect(0, 0, resolution, resolution);
    context.fillStyle = 'yellow'
    for (let y = 0; y < resolution; y++){
        for(let x = 0; x < resolution; x++){
            if (cells[x][y]) 
                //Posición que ocupa la bacteria en coordenadas de la cuadrícula
                context.fillRect(x,y,1,1) 
        }
    }
}

//Reglas para la supervivencia de las bacterias
function step(){
    let newCells = createCells();
    let cellsAlive = 0
    for (let y = 0; y < resolution; y++){
        for (let x = 0; x < resolution; x++){
            const neighbours = getNeightbourCount(x,y);
            if (cells[x][y] && neighbours >= 2 && neighbours <= 3) 
                newCells[x][y] = true; 
            else if (!cells[x][y] && neighbours === 3)
                //Si las bacterias de alrededor son igual a 3, la bacteria vivirá
                newCells[x][y] = true; 
            cellsAlive += cells[x][y] ? 1 : 0 
        }
    }
    setResults(generation++,cellsAlive)
    cells = newCells;
    drawCells();
}

//Contador de bacterias activas
function cellsALiveCount(){
    let newCells = createCells();
    let cellsAlive = 0
    for (let y = 0; y < resolution; y++){
        for (let x = 0; x < resolution; x++){
            const neighbours = getNeightbourCount(x,y);
            if (cells[x][y] && neighbours >= 2 && neighbours <= 3) 
                newCells[x][y] = true;
            else if (!cells[x][y] && neighbours === 3) 
                newCells[x][y] = true;
            cellsAlive += cells[x][y] ? 1 : 0 
        }
    }
    return cellsAlive;
}
//Función para determinar si una bacteria tiene más bacterias circundantes y su cantidad
function getNeightbourCount(x, y){
    let count = 0;
    for (let yy = -1; yy < 2; yy++){
        for (let xx = -1; xx < 2; xx++){
            if (xx === 0 && yy === 0) 
                continue;
            if (x + xx < 0 || x + xx > resolution - 1) 
                continue;
            if (y + yy < 0 || y + yy > resolution - 1) 
                continue;
            if (cells[x + xx][y + yy]) 
                count++;
        }
    }
    return count;
}
//Establecer los datos en tiempo real de la generación y población de bacterias
function setResults(generation, cellsAlive){
    document.getElementById('generation').innerHTML = generation;
    document.getElementById('population').innerHTML = cellsAlive;
}