<script lang="ts">
	import type { Tile } from "../lib/types";
	import { generateGrid, getAdjacentTiles } from "../lib/utils";

    let tiles = generateGrid(30, 16);
    $: tiles;

    let flags = 0;
    $: flags;

    let revealed = 0;
    $: revealed;

    const countFlags = () => {
        let mines = 0;
        let flagged = 0;
        revealed = 0;

        tiles.forEach((row) => {
            row.forEach((tile) => {
                if (tile.isMine) mines++;
                if (tile.isFlagged) flagged++;
                if (tile.isRevealed) revealed++;
            });
        });

        flags = mines - flagged;
    };

    const restart = () => {
        tiles = generateGrid(30, 16, 99);
        flags = 0;
        isLost = false;
    };

    $: tiles, countFlags();

    const tileMineCountTextColors = [
        "text-purple-900",
        "text-blue-900",
        "text-green-900",
        "text-orange-900",
        "text-yellow-900",
        "text-red-900",
    ];

    const revealAdjacent = (tile: Tile, finalRound = false) => {
        const adjacentTiles = getAdjacentTiles(tiles, tile);

        adjacentTiles.forEach(adjacentTile => {
            if (!adjacentTile || adjacentTile.isRevealed) return;

            if (tile.surroundingMines === 0 || finalRound) {
                tiles[adjacentTile.row][adjacentTile.col] = { ...adjacentTile, isRevealed: true };
                revealAdjacent(adjacentTile, tile.surroundingMines > 0);
            };
        });
    };

    $: isLost = false;
 </script>

{#if isLost}
    <div class="absolute w-screen h-screen flex items-center justify-center bg-black bg-opacity-40">
        <div class="flex flex-col items-center lw-[400px] bg-dark-primary rounded-md p-4">
            <h1 class="text-error font-bold text-xl">You Lost</h1>
            <button
                class="px-4 py-2 mt-4 font-bold rounded-md bg-secondary"
                on:click={restart}
            >
                Restart
            </button>
        </div>
    </div>
{/if}
<div class="flex flex-col items-center justify-center h-screen">
    <h1 class="font-bold text-4xl">Minesweeper Clone</h1>
    <div class="flex flex-col">
        <div class="flex flex-row my-8">
            <div class="flex flex-row justify-between w-full">
                <p>Flags: <span>{flags}</span></p>
                <button
                    class="px-4 py-2 rounded-md font-bold bg-accent"
                    on:click={restart}
                >
                    Restart
                </button>
                <p>Time: <span>000</span></p>
            </div>
        </div>
        {#each tiles as row, i}
            <div class="flex flex-row">
                {#each row as tile, j}
                    <button
                        class="tile hover:cursor-default {tile.isRevealed ? "flipped" : ""}"
                        on:click={() => {
                            if (tile.isFlagged) return;
                            if (tile.isMine) {
                                restart();
                                if (revealed > 0) {
                                    isLost = true;
                                    return;
                                };
                            };

                            tiles[i][j] = {
                                ...tile,
                                isRevealed: true,
                            };

                            if (tile.surroundingMines === 0) revealAdjacent(tile);

                            tiles = tiles;
                        }}
                        on:contextmenu={e => {
                            e.preventDefault();

                            tiles[i][j] = {
                                ...tile,
                                isFlagged: !tile.isFlagged && !tile.isMarked,
                                isMarked: tile.isFlagged && !tile.isMarked,
                            };
                            tiles = tiles;
                        }}
                    >
                        {#if tile.isRevealed}
                            {#if tile.surroundingMines > 0}
                                <p class="mines text-xl font-bold {tileMineCountTextColors[tile.surroundingMines - 1]}">{tile.surroundingMines}</p>
                            {/if}
                        {:else if tile.isFlagged}
                            <div class="flex items-center justify-center w-full h-full">
                                <img
                                    src="/icons/flagged.svg"
                                    alt="flagged"
                                />
                            </div>
                        {:else if tile.isMarked}
                        <div class="flex items-center justify-center w-full h-full">
                            <img
                                src="/icons/marked.svg"
                                alt="marked"
                            />
                        </div>
                        {/if}
                    </button>
                {/each}
            </div>
        {/each}
    </div>
</div>

<style lang="postcss">
    .tile {
        @apply w-10 h-10 bg-dark-secondary rounded-sm border border-solid border-black;
    }

    .tile.flipped {
        @apply bg-secondary;
    }
</style>