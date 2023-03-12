import { Player } from '../js/player'

test("player shot on computer's board", () => {
    let player = Player('ahmad')
    let computer = Player ('AI')

    expect(player.name).toBe('ahmad')
    expect(computer.name).toBe('AI')

    for(let num = 1; num <= 5; ++num) computer.gameBoard.placeShip(num, 'X', { row: num + 1, col: num})    
    
    player.shot(computer, { row : 1, col: 1 })
    expect(computer.gameBoard.board[1][1]).toBe(-1)
    player.shot(computer, { row : 2, col: 0 })
    expect(computer.gameBoard.board[2][0]).toBe(2)

    player.shot(computer, { row : 2, col: 1 })
    expect(computer.gameBoard.board[2][1]).toBe(2)
    player.shot(computer, { row : 2, col: 2 })
    expect(computer.gameBoard.board[2][2]).toBe(2)
    player.shot(computer, { row : 2, col: 3 })
    expect(computer.gameBoard.board[2][3]).toBe(2)
})  