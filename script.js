// UI
const canvas = document.getElementById("myCanvas")
const nextCanvas = document.getElementById("nextCanvas")
const textoPunteo = document.getElementById("scoreNumber")
const textoLineas = document.getElementById("linesNumber")
const textoCompleto = document.getElementById("fullNumber")

// Preparando pizarra
const context = canvas.getContext("2d")
const tamanioBloque = 30
const anchoPizarra = 10
const altoPizarra = 20

// Preparando colores
const blockColors = ['black', 'red', 'orange', 'yellow', '#00ff00', 'cyan', 'blue', '#fab3f5', 'gray']
const colorCount = blockColors.length - 2

// construimos el tablero de 20 filas por 10 columnas
let pizarra = Array.from({ length: altoPizarra }, () => Array(anchoPizarra).fill(0))

// bloque siguiente
const siguienteContexto = nextCanvas.getContext("2d")
const nextAnchoPizarra = 4
const nextAltoPizarra = 3
let siguienteTablero = Array.from({ length: nextAltoPizarra }, () => Array(nextAnchoPizarra).fill(0))

// variables del juego
let punteo = 0
let lineas = 0
let piezasBuenas = 0
let piezasMalas = 0

// bloques
const block_rojo = {
    rotations: [
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }],
        [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: -2 }, { x: 0, y: -3 }]
    ]
}

const block_naranja = {
    rotations: [
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 2, y: -1 }],
        [{ x: 0, y: -2 }, { x: 1, y: -2 }, { x: 1, y: -1 }, { x: 1, y: 0 }],
        [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: 1, y: -1 }, { x: 2, y: -1 }],
        [{ x: 0, y: -2 }, { x: 0, y: -1 }, { x: 0, y: 0 }, { x: 1, y: 0 }]
    ]
}

const block_amarillo = {
    rotations: [
        [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 1, y: -1 }]
    ]
}

const block_verde = {
    rotations: [
        [{ x: 0, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
        [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: 1, y: -1 }, { x: 1, y: -2 }]
    ]
}

const block_purpura = {
    rotations: [
        [{ x: 0, y: -1 }, { x: 1, y: -1 }, { x: 2, y: -1 }, { x: 1, y: 0 }],
        [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: -2 }, { x: 1, y: -1 }],
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: -1 }],
        [{ x: 1, y: 0 }, { x: 1, y: -1 }, { x: 1, y: -2 }, { x: 0, y: -1 }]
    ]
}

const block_azul = {
    rotations: [
        [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
        [{ x: 1, y: -2 }, { x: 0, y: -2 }, { x: 0, y: -1 }, { x: 0, y: 0 }],
        [{ x: 2, y: 0 }, { x: 2, y: -1 }, { x: 1, y: -1 }, { x: 0, y: -1 }],
        [{ x: 1, y: -2 }, { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 0 }]
    ]
}

const block_morado = {
    rotations: [
        [{ x: 2, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 0 }],
        [{ x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: -1 }, { x: 0, y: -2 }]
    ]
}

const candidatos_piezas = [block_rojo, block_naranja, block_amarillo, block_verde, block_purpura, block_azul, block_morado]

let colorActual = getRandomValue(candidatos_piezas.length) + 1
let siguientePieza = candidatos_piezas[colorActual - 1]

let piezaActual = {
    rotations: siguientePieza.rotations,
    rotation_state: 0
}

const CicloPrimerNivel = 30
let piece_x = 0
let piece_y = 0
let ticks = 0
let cicloTick = CicloPrimerNivel

// ---- FUNCIONES ----------------------------------------------

const dibujarBloque = (x, y, color, ctx) => {
    ctx.fillStyle = blockColors[color]
    ctx.fillRect(x * tamanioBloque, y * tamanioBloque, tamanioBloque, tamanioBloque)

    // borde
    ctx.strokeStyle = "#555"
    ctx.strokeRect(x * tamanioBloque, y * tamanioBloque, tamanioBloque, tamanioBloque)
}

const dibujarPizara = () => {
    pizarra.forEach((row, y) => {
        row.forEach((color, x) => {
            dibujarBloque(x, y, color, context)
        })
    })
}

const dibujarSiguientePizarra = () => {
    siguienteTablero.forEach((row, y) => {
        row.forEach((color, x) => {
            dibujarBloque(x, y, color, siguienteContexto)
        })
    })
}

const dibujarSiguienteBloque = () => {
    obtenerCoordenadasPiezaActual().forEach(coords => {
        dibujarBloque(piece_x + coords.x, piece_y + coords.y, colorActual, context)
    })
}

const moverPieza = () => {
    salvarPiezaLimpia(piece_x, piece_y)

    if (sePuedeMoverPieza(piece_x, piece_y + 1)) {

        piece_y++
    } else {
        salvarPiezaPintada(piece_x, piece_y)

        if (esValidoPizarron()) {
            let lineasAgregadas = 0
            const altoAchekar = obtenerAltoDePieza(obtenerCoordenadasPiezaActual())

            while (checarLinea(piece_y, altoAchekar)) lineasAgregadas++
            if (lineasAgregadas) agregarPunteo(100 * lineasAgregadas)
            else agregarPunteo(Math.round(piece_y / 4))

            piezaActual = {
                rotations: siguientePieza.rotations,
                rotation_state: 0
            }

            piece_x = anchoPizarra / 2
            colorActual = obtenerSiguienteColor()

            escogerSiguienteBloque()
            dibujarSiguientePizarra()
        } else {
            juegoPerdido()
        }

        piece_y = -1
    }
}


const agregarPunteo = (diff) => {
    punteo += diff
    textoPunteo.innerText = punteo.toString()

    if (diff >= 100) piezasBuenas += diff / 10
    else if (diff == 5) piezasBuenas += 1
    else {
        piezasMalas += Math.pow((5 - diff), 2)

        if (piezasMalas > 100) {
            piezasMalas /= 4
            piezasBuenas /= 4
        }
    }

    efficiency = piezasMalas ? (piezasBuenas) / (piezasBuenas + piezasMalas) : 1
    textoCompleto.innerText = `${Math.floor(efficiency * 100)}%`
}


const escogerSiguienteBloque = () => {
    let color = getRandomValue(candidatos_piezas.length) + 1
    siguientePieza = candidatos_piezas[color - 1]


    siguienteTablero.forEach((row, y) => {
        row.forEach((color, x) => {
            siguienteTablero[y][x] = 0
        })
    })

    siguientePieza.rotations[0].forEach(coords => {
        siguienteTablero[2 + coords.y][0 + coords.x] = color
    })
}

const obtenerSiguienteColor = () => {
    return siguienteTablero[2 + siguientePieza.rotations[0][0].y][0 + siguientePieza.rotations[0][0].x]
}

const checarLinea = (sinceRow, iterations) => {
    let y_check = -1


    for (i = 0; i < iterations; i++) {
        let full = true

        pizarra[sinceRow - i].forEach(color => {
            if (color === 0) {
                full = false
                return
            }
        })

        if (full) y_check = sinceRow - i
    }


    if (y_check > -1) {
        for (y = y_check - 1; y > -1; y--) {
            for (x = 0; x < anchoPizarra; x++) {
                pizarra[y + 1][x] = pizarra[y][x]
            }
        }

        lineas++
        textoLineas.innerText = lineas.toString()


        if (lineas < 100) {
            cicloTick = CicloPrimerNivel - Math.floor(lineas / 5)
        } else {
            cicloTick = Math.max(1, CicloPrimerNivel - 20 - Math.floor((lineas - 100) / 10))
        }

        return true
    }

    return false
}

const juegoPerdido = () => {
    const grayColor = blockColors.length - 1

    pizarra.forEach((row, y) => {
        row.forEach((color, x) => {
            if (color) pizarra[y][x] = grayColor
        })
    })
}

const resetearJuego = () => {
    pizarra = pizarra.map(row => row.map(color => 0))
    siguienteTablero = siguienteTablero.map(row => row.map(color => 0))
    punteo = 0
    lineas = 0
    piezasBuenas = 0
    piezasMalas = 0
    cicloTick = CicloPrimerNivel

    escogerSiguienteBloque()
    dibujarPizara()
    dibujarSiguientePizarra()

    textoLineas.innerText = "0"
    textoPunteo.innerText = "0"
    textoCompleto.innerText = "100%"

    piece_x = anchoPizarra / 2
    piece_y = -1
}

function gameLoop() {
    if (++ticks == cicloTick) {
        moverPieza()
        ticks = 0
    }

    dibujarPizara()
    dibujarSiguienteBloque()
}

// ---- LISTENERS -----------------

document.addEventListener('keydown', e => {
    console.log(e)

    if (e.key == "Enter") {
        resetearJuego()
    } else if (e.key == "ArrowRight") {
        if (sePuedeMoverPieza(piece_x + 1, piece_y)) {
            piece_x++
        }
    } else if (e.key == "ArrowLeft") {
        if (sePuedeMoverPieza(piece_x - 1, piece_y)) {
            piece_x--
        }
    } else if (e.key == "ArrowDown") {
        if (sePuedeMoverPieza(piece_x, piece_y + 1)) {
            piece_y++
        }
    } else if (e.key == " ") {
        if (canPieceRotate()) {
            piezaActual.rotation_state = (piezaActual.rotation_state + 1) % piezaActual.rotations.length
        }
    }
})

// ---- UTILIDADES ---------------------

const salvarPaint = (x, y) => {
    if (esLugarValido(x, y)) pizarra[y][x] = colorActual
}

const salvarPiezaPintada = (x0, y0) => {
    obtenerCoordenadasPiezaActual().forEach(coords => {
        salvarPaint(x0 + coords.x, y0 + coords.y)
    })
}

const salvarLimpio = (x, y) => {
    if (esLugarValido(x, y)) pizarra[y][x] = 0
}

const salvarPiezaLimpia = (x0, y0) => {
    obtenerCoordenadasPiezaActual().forEach(coords => {
        salvarLimpio(x0 + coords.x, y0 + coords.y)
    })
}

const sePuedeMover = (x, y) => {
    return esLugarValido(x, y) && pizarra[y][x] == 0
}

const sePuedeMoverPieza = (x0, y0) => {
    let ok = true

    obtenerCoordenadasPiezaActual().forEach(coords => {
        const x = x0 + coords.x
        const y = y0 + coords.y

        if (y < 0) {
            // arriba del tablero
            if (x < 0 || x >= anchoPizarra) {
                ok = false
                return
            }
        } else {
            // dentro del tablero
            if (!sePuedeMover(x, y)) {
                ok = false
                return
            }
        }
    })

    return ok
}

function canPieceRotate() {
    let test_rotation_state = (piezaActual.rotation_state + 1) % piezaActual.rotations.length
    return isPieceInside(piece_x, piece_y, piezaActual.rotations[test_rotation_state])
}

const esLugarValido = (x, y) => {
    return (y >= 0 && y < altoPizarra && x >= 0 && x < anchoPizarra)
}

function isCellOutside(x, y) {
    return (y >= altoPizarra || x < 0 || x >= anchoPizarra)
}

function isCellOccupied(x, y) {
    return pizarra[y][x] != 0
}

function isPieceInside(x0, y0, relative_coords) {
    let inside = true

    relative_coords.forEach(coords => {
        const x = x0 + coords.x
        const y = y0 + coords.y

        if (y >= 0 && (isCellOutside(x, y) || isCellOccupied(x, y))) {
            inside = false
            return
        }
    })

    return inside
}

const esValidoPizarron = () => {
    let result = true

    pizarra[0].forEach(color => {
        if (color) {
            result = false
            return
        }
    })

    return result
}

const obtenerCoordenadasPiezaActual = () => {
    return piezaActual.rotations[piezaActual.rotation_state]
}

const obtenerAltoDePieza = (relative_coords) => {
    let min_y = 0

    relative_coords.forEach(coords => {
        if (coords.y < min_y) min_y = coords.y
    })

    return (1 - min_y)
}

function getRandomValue(max) {
    return Math.floor(Math.random() * max);
}

function getRandomColor(count) {
    return Math.floor(Math.random() * count) + 1
}

function testBoard() {
    for (x = 0; x < anchoPizarra; x++) {
        for (y = 0; y < altoPizarra; y++) {
            pizarra[y][x] = getRandomValue(3)
        }
    }
}

// ---- iniciar el programa --------------

resetearJuego()
setInterval(gameLoop, 20)