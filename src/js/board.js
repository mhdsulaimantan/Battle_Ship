/*
board values
-1 => missed shot
0 => empty
1 => ship body
2 => hit ship body
*/

import { Ship } from './ship'

export const GameBoard = () => {
    let board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
    
    const ships = [Ship(1, 'Carrier', 5),
    Ship(2, 'BattleShip', 4),
    Ship(3, 'Cruiser', 3),
    Ship(4, 'Submarine', 3),
    Ship(5, 'Destroyer', 2)]

    const placeShip = (shipNum, axis, coord) => {
        const ship = findShip(shipNum)
        ship.setShipCoordinate(axis, coord)

        ship.data().coord.forEach( coord => {
            board[coord.row][coord.col] = 1 
        });
    }

    const findShip = (shipNum) => {
        return ships.find(ship => { return ship.data().num === shipNum })
    }

    const receivedAttack = (shotCoordinate) => {
        if (board[shotCoordinate.row][shotCoordinate.col]) {
            const ship = getAttackedShip(shotCoordinate)
            ship.hit()
            board[shotCoordinate.row][shotCoordinate.col] = 2
        }

        else board[shotCoordinate.row][shotCoordinate.col] = -1

        return board[shotCoordinate.row][shotCoordinate.col]
    }

    const getAttackedShip = (shotCoordinate) => {
        return ships.find(ship => 
            ship.data().coord.find(shipPos =>
                shipPos.row === shotCoordinate.row && shipPos.col === shotCoordinate.col
            )
        )
    }

    const isAllShipsSunk = () => {
        if (ships.some(ship => { return ship.data().sunk === false })) return false
        return true
    }

    const getAliveShipsNumber = () => { 
        return ships.reduce((num, ship) => {
            if (!ship.data().sunk) return num += 1
            return num
        }, 0)
    }

    return { board, placeShip, findShip, receivedAttack, isAllShipsSunk, getAliveShipsNumber }
}