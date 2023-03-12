import { GameBoard } from '../js/board'

test('Test Game Board place ship function for a specific ship 1', () => {
    const board = GameBoard()
    const shipNum = 2
    const ship = board.findShip(shipNum)

    const coord = { row: 4, col: 2 }
    board.placeShip(shipNum, 'Y', coord)
    
    expect(ship.data()).toEqual({
        num: 2,
        name: 'BattleShip',
        length: 4,
        coord: [
            { row: 2, col: 2},
            { row: 3, col: 2},
            { row: 4, col: 2},
            { row: 5, col: 2}
        ],
        hits: 0,
        sunk: false
    })
})

test('Test Game Board place for specific ship 3', () => {
    const board = GameBoard()
    const shipNum = 3
    const ship = board.findShip(shipNum)

    const coord = { row: 3, col: 3 }
    board.placeShip(shipNum, 'X', coord)
    
    expect(ship.data()).toEqual({
        num: 3,
        name: 'Cruiser',
        length: 3,
        coord: [
            { row: 3, col: 2},
            { row: 3, col: 3},
            { row: 3, col: 4},
        ],
        hits: 0,
        sunk: false
    })  
})

test('Game Board test the board after placing the ships', () => {
    const gameBoard = GameBoard()
    gameBoard.placeShip(1, 'X', { row: 3, col: 3 })
    gameBoard.placeShip(2, 'Y', { row: 6, col: 3 })
    expect(gameBoard.board).toEqual([
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ])
    
})

test('Game Board test if all ship is sunk 1', () => {
    const gameBoard = GameBoard() 
    expect(gameBoard.isAllShipsSunk()).toBeFalsy()
})

test('Game Board test if all ship is sunk 2', () => {
    const gameBoard = GameBoard() 
    gameBoard.placeShip(1, 'X', { row: 1, col: 1})
    gameBoard.placeShip(2, 'X', { row: 2, col: 1}) 
    gameBoard.placeShip(3, 'Y', { row: 3, col: 1}) 
    gameBoard.placeShip(4, 'Y', { row: 3, col: 2})
    gameBoard.placeShip(5, 'X', { row: 7, col: 8})        
    //ship 1
    gameBoard.receivedAttack({ row: 1, col: 1})
    gameBoard.receivedAttack({ row: 1, col: 1})
    gameBoard.receivedAttack({ row: 1, col: 1})
    gameBoard.receivedAttack({ row: 1, col: 1})
    gameBoard.receivedAttack({ row: 1, col: 1})
    //ship2
    gameBoard.receivedAttack({ row: 2, col: 1})
    gameBoard.receivedAttack({ row: 2, col: 1})
    gameBoard.receivedAttack({ row: 2, col: 1})
    gameBoard.receivedAttack({ row: 2, col: 1})
    //ship 3
    gameBoard.receivedAttack({ row: 3, col: 1})
    gameBoard.receivedAttack({ row: 3, col: 1})
    gameBoard.receivedAttack({ row: 3, col: 1})
    //ship 4
    gameBoard.receivedAttack({ row: 3, col: 2})
    gameBoard.receivedAttack({ row: 3, col: 2})
    gameBoard.receivedAttack({ row: 3, col: 2})
    // ship 5
    gameBoard.receivedAttack({ row: 7, col: 8})
    gameBoard.receivedAttack({ row: 7, col: 8})

    expect(gameBoard.isAllShipsSunk()).toBeTruthy()
})