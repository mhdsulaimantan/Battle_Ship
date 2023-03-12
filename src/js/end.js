import victoryImg from '../img/victory.gif'
import loseImg from '../img/lose.gif'
import bugleEnd from '../audio/bugle_end.mp3'

import Swal from 'sweetalert2'
import { getGame, pageElements } from '.'

let game

export const endTheGame = () => {
    game = getGame()

    const winnerName = game.checkTheWinner()

    if(winnerName !== 'AI') winLayout()
    
    else loseLayout()
}

const winLayout = async () => {
    await Swal.fire({
        imageUrl: victoryImg,
        imageHeight: 300,
        imageAlt: 'victory image',
        text: 'Do you want to replay the game?',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        onOpen : new Audio(bugleEnd).play()
    }).then((result) => {
        if(result.isConfirmed) {
            window.location.reload()
            document.body.style.overflow = 'hidden'
        }

        else if(result.isDenied) pageElements.computerMap.style.pointerEvents = 'none'
    })
}

const loseLayout = async () => {
    await Swal.fire({
        imageUrl: loseImg,
        imageHeight: 300,
        imageAlt: 'lose image',
        text: 'Do you want to replay the game?',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        onOpen : new Audio(bugleEnd).play()
    }).then((result) => {
        if(result.isConfirmed) {
            window.location.reload()
            document.body.style.overflow = 'hidden'
        }

        else if(result.isDenied) pageElements.computerMap.style.pointerEvents = 'none'
    })
}