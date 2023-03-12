import { endTheGame } from './end'
import { getGame, pageElements } from "."

import canonFire from '../audio/canon_fire.mp3'
import explosion from '../audio/explosion.mp3'
import waterSplash from '../audio/water_splash.mp3'

let game

export const startTheGame = async () => {
    game = getGame()

    showPlayerTurnBox()

    game.computerPlaceShips()

    computerMapEvents()
}

const showPlayerTurnBox = () => {
    pageElements.playerTurnBox.classList.remove('invisible')
    pageElements.playerTurnBox.textContent = game.getPlayer().name + ' turn'
}

const computerMapEvents = () => {
    pageElements.computerMap.querySelectorAll('[col-num]').forEach(cell => {
        cell.onmouseenter = () => cell.classList.add('shot-hover')
        
        cell.onmouseleave = () => cell.classList.remove('shot-hover')
        
        cell.onclick = async () => {
            new Audio(canonFire).play()

            resetPlayerTurnAnimation()

            deactivateComputerMapEvents()

            checkShotSituation(cell)

            checkShipsSituation(game.getComputer())

            if (game.isGameEnded()) endTheGame()

            else await new Promise(resolve => setTimeout(() => (computerTurn(), resolve()), 3000))
            
            activateComputerMapEvents()
        }
    })
}

const deactivateComputerMapEvents = () => {
    pageElements.computerMap.style.pointerEvents = 'none'
}

const activateComputerMapEvents = () => {
    pageElements.computerMap.style.pointerEvents = 'auto'
}

const resetPlayerTurnAnimation = () => {
    pageElements.playerTurnBox.style.webkitAnimation = ''
    setTimeout(() => pageElements.playerTurnBox.style.animation = 'none', 2000)
}

const checkShotSituation = (cell) => {
    const shot = game.playerAttack(getCellCoordinate(cell))

    if (shot === -1) missingShotAction(game.getPlayer().name, cell)

    else if (shot === 2) hittingShotAction(game.getPlayer().name, cell)
}

const checkShipsSituation = (player) => {
    const num = player.gameBoard.getAliveShipsNumber()
    if(player.name === 'AI') pageElements.computerShipsNum.textContent = num
    else pageElements.playerShipsNum.textContent = num   
}

const computerTurn = async () => {
    resetPlayerTurnAnimation()

    const shotData = game.computerAttack()

    const cell = pageElements.playerMap.
        querySelector("[row-num='" + shotData.coord.row + "']").
        querySelector("[col-num='" + shotData.coord.col + "']")

    if (shotData.value === -1) missingShotAction(game.getComputer().name, cell)

    else if (shotData.value === 2) {
        hittingShotAction(game.getComputer().name, cell)
        cell.classList.remove('ship-background')
    }

    checkShipsSituation(game.getPlayer())

    if (game.isGameEnded()) endTheGame()
}

const getCellCoordinate = (cell) => {
    return {
        row: parseInt(cell.getAttribute('col-num')),
        col: parseInt(cell.parentNode.getAttribute('row-num'))
    }
}

const missingShotAction = (name, cell) => {
    new Audio(waterSplash).play()
    cell.classList.add('missing-shot')
    cell.style.pointerEvents = 'none'
    pageElements.playerTurnBox.textContent = name + ' missed his shot'
}

const hittingShotAction = (name, cell) => {
    new Audio(explosion).play()
    cell.classList.add('hit-shot')
    cell.style.pointerEvents = 'none'
    pageElements.playerTurnBox.textContent = name + ' hit an enemy ship'
}