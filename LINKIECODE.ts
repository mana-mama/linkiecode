/**
 * LINKIECODE EXTENSION BLOCKS
 */
//% color=#5C97BB icon="\uf1e0" block="LINKIECODE"

namespace LINKIECODE {
    export enum PetAction {
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

    export enum BotAction {
        //% block="Forward"
        Forward,
        //% block="Backward"
        Backward,
        //% block="Turn Left"
        Left,
        //% block="Turn Right"
        Right
    }

    export enum CarAction {
        //% block="Forward"
        Forward,
        //% block="Backward"
        Backward,
        //% block="Turn Left"
        Left,
        //% block="Turn Right"
        Right
    }

    export enum HomeAction {
        //% block="Open"
        Open,
        //% block="Close"
        Close
    }

    //% block="Robotic Pet|$first"
    export function RoboticPet(first: PetAction){
        
    }

    //% block="Boxy Bot|$first"
    export function BoxyBot(first: BotAction) {
        
    }

    //% block="Smart Car|$first"
    export function SmartCar(first: CarAction) {
        
    }

    //% block="Smart Home|$first"
    export function SmartHome(first: HomeAction) {
        
    }
}