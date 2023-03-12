import carrierImg from '../img/carrier.png'
import battleshipImg from '../img/battleship.png'
import cruiserImg from '../img/cruiser.png'
import submarineImg from '../img/submarine.png'
import destroyerImg from '../img/destroyer.png'
import clickSound from '../audio/click.mp3'
import bugleStartSound from '../audio/bugle_start.mp3'
import oceanAudio from '../audio/ocean.mp3'

import interact from 'interactjs'
import Swal from 'sweetalert2'

import { getGame ,pageElements } from '.'
import { startTheGame } from './start'


let game
let shipAxis
let oceanSound

export const createGameLayout = () => {
    initiateLayoutAttributes()
    cleanTheLayout()
    playOceanSound()
    showGameContainer()
    createShipsImages()
    createPlayerMap()
    createComputerMap()
    interactImages()
    applyChangeableAxis()
    showFooter()
}

const initiateLayoutAttributes = () => {
    game = getGame()
    shipAxis = 'X'
    oceanSound = new Audio(oceanAudio)
} 

const cleanTheLayout = () => {
    document.body.style.backgroundImage = 'none'
    document.body.style.overflow = 'auto'
    document.body.style.background = '#3682c0'
    pageElements.gameOptions.remove()
}

const playOceanSound = () => {
    oceanSound.loop = true
    oceanSound.play()
}

const pauseOceanSound = () => oceanSound.pause()

const showGameContainer = () => {
    pageElements.gameContainer.classList.remove('invisible')
}

const createShipsImages = () => {
    pageElements.shipsImg.innerHTML =
    `<img class="drag-drop" src="${carrierImg}" style="width:15rem;height:3rem" alt="carrier" title="carrier" ship-num="1">
    <img class="drag-drop" src="${battleshipImg}" style="width:11rem;height:3rem" alt="battleship" title="battleship" ship-num="2">
    <img class="drag-drop" src="${cruiserImg}" style="width:8rem;height:3rem" alt="cruiser" title="cruiser" ship-num="3">
    <img class="drag-drop" src="${submarineImg}" style="width:8rem;height:3rem" alt="submarine" title="submarine" ship-num="4">
    <img class="drag-drop" src="${destroyerImg}" style="width:6rem;height:3rem" alt="destroyer" title="destroyer" ship-num="5">`
}

const createPlayerMap = () => {
    for (let row = 0; row <= 9; ++row) {
        const rowElement = document.createElement('div')
        rowElement.className = 'row row-col-auto'
        rowElement.setAttribute('row-num', row)

        for (let col = 0; col <= 9; ++col) {
            const colElement = document.createElement('div')
            colElement.className = 'col dropzone'
            colElement.setAttribute('col-num', col)
            rowElement.appendChild(colElement)
        }
        pageElements.playerMap.appendChild(rowElement)
    }
}

const createComputerMap = () => {
    for (let row = 0; row <= 9; ++row) {
        const rowElement = document.createElement('div')
        rowElement.className = 'row row-col-auto'
        rowElement.setAttribute('row-num', row)

        for (let col = 0; col <= 9; ++col) {
            const colElement = document.createElement('div')
            colElement.className = 'col d-flex align-items-center'
            colElement.setAttribute('col-num', col)
            rowElement.appendChild(colElement)
        }
        pageElements.computerMap.appendChild(rowElement)
    }
}

const interactImages = () => {

    interact('.dropzone').dropzone({
        accept: '.drag-drop',
        overlap: 'center',


        ondropactivate: (event) => {
            event.target.classList.add('drop-active')
        },

        ondragenter: (event) => {
            if (checkAllShipCoordInDropzone(event)) {
                getAllPlayerShipCoord(event).forEach(coord => {
                    pageElements.playerMap.
                        querySelector("[row-num='" + coord.row + "']").
                        querySelector("[col-num='" + coord.col + "']").
                        classList.add('drop-target')
                })
            }
        },

        ondragleave: (event) => {
            if (checkAllShipCoordInDropzone(event)) {
                getAllPlayerShipCoord(event).forEach(coord => {
                    pageElements.playerMap.
                        querySelector("[row-num='" + coord.row + "']").
                        querySelector("[col-num='" + coord.col + "']").
                        classList.remove('drop-target')
                })
            }
        },

        ondrop: async (event) => {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top',
                iconColor: 'white',
                customClass: {
                    popup: 'colored-toast'
                },
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true
            })

            if (checkAllShipCoordInDropzone(event)) {
                new Audio(clickSound).play()

                playerPlaceShip(event)

                const shipElement = event.relatedTarget
                shipElement.remove('drag-drop')

                getAllPlayerShipCoord(event).forEach(coord => {
                    const element = pageElements.playerMap.
                        querySelector("[row-num='" + coord.row + "']").
                        querySelector("[col-num='" + coord.col + "']")

                    element.classList.remove('dropzone')
                    element.classList.add('ship-background')
                })


                await Toast.fire({
                    icon: 'success',
                    title: 'Your ship dropped successfully'
                })

                if (isAllShipsPlaced()) finishPlacingShips()
            }

            else {
                await Toast.fire({
                    icon: 'error',
                    title: "Your can't drop your ship here"
                })
            }
        },

        ondropdeactivate: (event) => {
            event.target.classList.remove('drop-active')
        }
    })

    interact('.drag-drop')
        .draggable({
            inertia: true,
            modifiers: [
                interact.modifiers.restrict({
                    outer: 'parent',
                    endOnly: true
                })
            ],
            autoScroll: true,
            listeners: { move: dragMoveListener }
        })
}

const dragMoveListener = (event) => {
    const target = event.target
    // keep the dragged position in the data-x/data-y attributes
    let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

    // translate the element
    if (shipAxis === 'X') target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
    else target.style.transform = 'translate(' + x + 'px, ' + y + 'px) rotate(90deg)'
    // update the position attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)
}

const getAllPlayerShipCoord = (event) => {
    const dropzoneElement = event.target
    const shipElement = event.relatedTarget
    const shipNum = parseInt(shipElement.getAttribute('ship-num'))

    const colNum = parseInt(dropzoneElement.getAttribute('col-num'))
    const rowNum = parseInt(dropzoneElement.parentElement.getAttribute('row-num'))
    const shipCoord = { row: rowNum, col: colNum }

    return game.getAllPlayerShipCoord(shipNum, shipAxis, shipCoord)
}

const playerPlaceShip = (event) => {
    const dropzoneElement = event.target
    const shipElement = event.relatedTarget
    const shipNum = parseInt(shipElement.getAttribute('ship-num'))

    const colNum = parseInt(dropzoneElement.getAttribute('col-num'))
    const rowNum = parseInt(dropzoneElement.parentElement.getAttribute('row-num'))
    const shipCoord = { row: rowNum, col: colNum }

    game.playerPlaceShip(shipNum, shipAxis, shipCoord)
}

const checkAllShipCoordInDropzone = (event) => {
    return getAllPlayerShipCoord(event).every(coord => {
        try {
            return pageElements.playerMap.
                querySelector("[row-num='" + coord.row + "']").
                querySelector("[col-num='" + coord.col + "']").
                classList.contains('dropzone')
        }
        catch { }
    })
}

const applyChangeableAxis = () => {

    pageElements.rotateBtn.addEventListener('click', (e) => {
        rotateImages()
        pageElements.rotateBtn.classList.remove('active');
    })

    document.addEventListener('keydown', (e) => {
        if (e.key === 'r') rotateImages()
    })

    document.addEventListener('keyup', (e) => {
        if (e.key === 'r') pageElements.rotateBtn.classList.remove('active');
    })
}

const rotateImages = () => {
    pageElements.rotateBtn.classList.add('active');

    pageElements.shipsImg.querySelectorAll('img').forEach(img => {
        if (shipAxis === 'X') {
            img.style.transform = 'rotate(90deg)'
            pageElements.shipsImg.style.height = '10rem'
        }
        else {
            img.style.transform = 'rotate(0deg)'
            pageElements.shipsImg.style.height = 'auto'
        }

        // return to start point
        img.setAttribute('data-x', 0)
        img.setAttribute('data-y', 0)
    })

    shipAxis === 'X' ? shipAxis = 'Y' : shipAxis = 'X'
}

const isAllShipsPlaced = () => {
    return pageElements.shipsImg.querySelectorAll('img').length === 0
}

const finishPlacingShips = async () => {
    pauseOceanSound()

    removePlaceShipsBox()
    
    generalMessage().then(() => startTheGame())
}

const removePlaceShipsBox = () => {
    pageElements.placeShips.style.opacity = '0';
    setTimeout(() => pageElements.placeShips.remove(), 1500);
} 

const generalMessage = () => {
    return Swal.fire({
        position: 'center',
        customClass: 'swal-background-img',
        showConfirmButton: false,
        width: '75%',
        timer: 4000,
        onOpen: new Audio(bugleStartSound).play() 
    })
}

const showFooter = () => {
    pageElements.footer.classList.remove('invisible')
}
