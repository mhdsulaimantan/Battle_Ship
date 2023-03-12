import { Game } from '../js/game'

const mockPlayerPlaceShips = jest.fn(game => {
    const col = 3
    let row = 0
    for(let num = 1; num <= 5; ++num) {
        game.playerPlaceShip(num, 'X', { row, col })
        row += 1
    }
})

test('Test the whole game', () => {
    const game = Game()

    game.startNewGame('ahmed')

    expect(game.isGameEnded()).toBeFalsy()
    expect(game.getComputer().gameBoard.isAllShipsSunk()).toBeFalsy()

    mockPlayerPlaceShips(game)
    game.computerPlaceShips()

    let isPlayer = true
    let row = 0
    let col = 0
    while (!game.isGameEnded()) {
        if (isPlayer) game.playerAttack({ row, col })
        else game.computerAttack()
        if (row === 9) {
            row = 0
            col += 1
        }
        row += 1
        isPlayer = !isPlayer
    }
    expect(game.isGameEnded()).toBeTruthy()
    expect(game.checkTheWinner()).toMatch(game.getComputer().name)
})