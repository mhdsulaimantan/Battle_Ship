export const Ship = (shipNum, shipName, shipLength) => {
    let hits = 0
    let shipCoordinate = null

    const hit = () => {
        if (!isSunk()) updateHits()
        return hits
    }

    const updateHits = () => {
        hits += 1
    }

    const setShipCoordinate = (axis, coord) => {
        shipCoordinate = calculateShipCoordinates(axis, coord)
    }

    const calculateShipCoordinates = (axis, coord) => {
        if (axis === 'X')
            return new Array(shipLength).fill().map((value, index) => { return { row: coord.row, col: coord.col + index - Math.floor(shipLength/2) } })
        else if (axis === 'Y')
            return new Array(shipLength).fill().map((value, index) => { return { row: coord.row + index - Math.floor(shipLength/2) , col: coord.col } })
    }

    const isSunk = () => {
        if (hits === shipLength) return true
        return false
    }

    const data = () => {
        return {
            num: shipNum,
            name: shipName,
            length: shipLength,
            hits,
            coord: shipCoordinate,
            sunk: isSunk()
        }
    }

    return { hit, setShipCoordinate, calculateShipCoordinates, isSunk, data }
};