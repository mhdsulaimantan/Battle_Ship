import { Player } from "./player"

export const Game = () => {
    let player = null
    let computer = null

    const startNewGame = (playerName) => {
        player = Player(playerName)
        computer = Player('AI')
    }

    const playerPlaceShip = (shipNum, axis, coord) => {
        player.gameBoard.placeShip(shipNum, axis, coord)
    }

    const computerPlaceShips = () => {
        let shipNum = 1
        while (shipNum <= 5) {
            const randomCoord = { row: Math.floor(Math.random() * 10), col: Math.floor(Math.random() * 10) }
            const randomAxis = ['X', 'Y'][Math.floor(Math.random() * 2)]

            const ship = computer.gameBoard.findShip(shipNum)
            const allShipCoord = ship.calculateShipCoordinates(randomAxis, randomCoord)

            const isCoordsInsideBoard = allShipCoord.every(coord =>
                (0 <= coord.row && coord.row < 10) && (0 <= coord.col && coord.col < 10)
            )

            if (isCoordsInsideBoard) {
                const isCoordsAlreadyTaken = allShipCoord.some(coord => {
                    return computer.gameBoard.board[coord.row][coord.col] === 1
                })

                if (!isCoordsAlreadyTaken) {
                    computer.gameBoard.placeShip(shipNum, randomAxis, randomCoord)
                    ++shipNum
                }
            }
        }
    }

    const getPlayer = () => {
        return player
    }

    const getComputer = () => {
        return computer
    }

    const getAllPlayerShipCoord = (shipNum, axis, coord) => {
        return player.gameBoard.findShip(shipNum).calculateShipCoordinates(axis, coord)
    }

    const isGameEnded = () => {
        if (player.gameBoard.isAllShipsSunk() || computer.gameBoard.isAllShipsSunk()) return true
        else return false
    }

    const playerAttack = (shotCoordinate) => {
        return player.shot(computer, shotCoordinate)
    }

    const computerAttack = () => {
        let row = Math.floor(Math.random() * 10)
        let col = Math.floor(Math.random() * 10)

        while (true) {
            if ([0, 1].includes(player.gameBoard.board[row][col])) break

            row = Math.floor(Math.random() * 10)
            col = Math.floor(Math.random() * 10)
        }

        return {
            coord: { row, col },
            value: computer.shot(player, { row, col })
        }

    }

    const checkTheWinner = () => {
        if (computer.gameBoard.isAllShipsSunk()) return player.name
        else return computer.name
    }

    return {
        startNewGame,
        playerPlaceShip,
        computerPlaceShips,
        getPlayer,
        getComputer,
        getAllPlayerShipCoord,
        isGameEnded,
        checkTheWinner,
        playerAttack,
        computerAttack
    }
}