import Swal from 'sweetalert2'
import '../scss/index.scss'

import { createGameLayout } from './layout'
import { Game } from "./game"

let game

window.onload = () => pageElements.newGame.onclick = async () => await clickNewGameBtn()

export const pageElements = (() => {
    const gameOptions = document.querySelector('#game-options')
    const gameContainer = document.querySelector('#game-container')
    const newGame = document.querySelector('#start-new-game')
    const loadGame = document.querySelector('#load-pre-game')
    const placeShips = document.querySelector('#place-ships')
    const shipsImg = document.querySelector('#ships-img')
    const rotateBtn = document.querySelector('[data-keyboard-key="r"]')
    const playerMap = document.querySelector('#player-map')
    const playerShipsNum = document.querySelector('#player-ships-num')
    const computerShipsNum = document.querySelector('#computer-ships-num')
    const computerMap = document.querySelector('#computer-map')
    const playerTurnBox = document.querySelector('#players-turn')
    const footer = document.querySelector('footer')

    return {
        gameOptions,
        newGame,
        loadGame,
        placeShips,
        shipsImg,
        rotateBtn,
        gameContainer,
        playerMap,
        playerShipsNum,
        computerMap,
        computerShipsNum,
        playerTurnBox,
        footer
    }
})()

const clickNewGameBtn = async () => {
    setGame()

    const playerName = await getPlayerName()

    if (playerName) {
        game.startNewGame(playerName)
        successMessage().then(() => createGameLayout())
    }
}

const setGame = () => game = Game()

export const getGame = () => { return game }

const getPlayerName = async () => {
    const { value: name } = await Swal.fire({
        title: 'Enter Your Name?',
        input: 'text',
        inputPlaceholder: 'Enter your name here...',
        icon: 'question'
    })
    return name
}

const successMessage = () => {
    return Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Your name saved successfully!',
        showConfirmButton: false,
        timer: 1500
    })
}