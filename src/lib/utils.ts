import type { Tile } from "./types";

export const getAdjacentTiles = (tiles: Tile[][], tile: Tile) => {
    let adjacentTiles = [
        tiles[tile.row][tile.col - 1],
        tiles[tile.row][tile.col + 1],
    ];

    if (tiles[tile.row - 1]) adjacentTiles = [
        ...adjacentTiles,
        tiles[tile.row - 1][tile.col - 1],
        tiles[tile.row - 1][tile.col],
        tiles[tile.row - 1][tile.col + 1],
    ];

    if (tiles[tile.row + 1]) adjacentTiles = [
        ...adjacentTiles,
        tiles[tile.row + 1][tile.col - 1],
        tiles[tile.row + 1][tile.col],
        tiles[tile.row + 1][tile.col + 1],
    ];

    return adjacentTiles;
};

export const generateGrid = (width = 9, height = 9, mines = 99): Tile[][] => {
    const tiles: Tile[][] = Array(height)
        .fill(0)
        .map((_, i) => Array(width)
            .fill({})
            .map((__, j) => {
                return {
                    isRevealed: false,
                    isMine: Math.random() < mines / (width * height),
                    isFlagged: false,
                    isMarked: false,
                    surroundingMines: 0,
                    row: i,
                    col: j,
                }
            }));

    tiles.forEach((row, i) => {
        row.forEach((tile, j) => {
            const mines = getAdjacentTiles(tiles, tile).map(tile => tile?.isMine);

            let mineCount = 0;

            mines.forEach(mine => mineCount += mine ? 1 : 0);

            tiles[i][j] = {
                ...tiles[i][j],
                surroundingMines: mineCount,
            };
        });
    });

    return tiles;
};