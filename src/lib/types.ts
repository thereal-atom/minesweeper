export interface Tile {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    isMarked: boolean;
    surroundingMines: number;
    row: number;
    col: number;
};