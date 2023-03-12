import { GameBoard } from "./board"

export const Player = (name) => {
    const playerName = name
    let gameBoard = GameBoard()

    const shot = (opponent, shotCoordinate) => {
        return opponent.gameBoard.receivedAttack(shotCoordinate)
    }

    const computerAttackCoordinate = () => {
        const row = Math.floor(Math.random() * 10)
        const col = Math.floor(Math.random() * 10)
        
        if(!gameBoard.board[row][col]) return { row, col }
        return computerAttackCoordinate()
    }
    
    return { name : playerName, gameBoard, shot }
}