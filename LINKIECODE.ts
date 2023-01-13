/**
 * Custom blocks
 */
//% weight=100 color=#3ADADA icon="LC"

namespace custom {
    export enum Move {
        //% block="Rest"
        Rest,
        //% block="Sit"
        Sit,
        //% block="Sleep"
        Sleep,
        //% block="Hello"
        Hello,
        //% block="Walk"
        Walk
    }

    //% blockId=show_moves
    //% block="$first"
    export function moves(first: Move){

    }
}