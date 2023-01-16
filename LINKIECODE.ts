/**
 * LINKIECODE EXTENSION BLOCKS
 */
//% color=#5C97BB icon="\uf1e0" block="LINKIECODE"

namespace LINKIECODE {
    export enum ToyMode {
        //% block="Boxy Bot"
        BoxyBot,
        //% block="Robotic Pet"
        RoboticPet,
        //% block="Smart Car"
        SmartCar,
        //% block="Smart Home"
        SmartHome
    }

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
        Walk,
        //% block="Dance"
        Dance,
        //% block="Tail Whip"
        TailWhip
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

    export enum UltrasonicUnit {
        //% block="μs"
        MicroSeconds,
        //% block="cm"
        Centimeters,
        //% block="inches"
        Inches
    }

    //% block="Calibrate Servo|$mode"
    //% weight=300
    export function Calibrate(mode: ToyMode) {
        switch (mode) {
            case ToyMode.RoboticPet:
            PetRest();
            ServoBot(Servos.S5, 45);
            break;
        }
    }

    export enum Servos {
        S1 = 0x01,
        S2 = 0x02,
        S3 = 0x03,
        S4 = 0x04,
        S5 = 0x05,
        S6 = 0x06,
        S7 = 0x07,
        S8 = 0x08,
    }

    //% block="Robotic Pet|$action"
    //% weight=180
    export function RoboticPet(action: PetAction){
        switch (action) {
            case PetAction.Rest:
                PetRest();
                break;
            case PetAction.Sleep:
                PetSleep();
                break;
            case PetAction.Sit:
                PetSit();
                break;
            case PetAction.Hello:
                PetHello();
                break;
            case PetAction.Walk:
                PetWalk();
                break;
            case PetAction.Dance:
                PetDance();
                break;
            case PetAction.TailWhip:
                TailWhip();
                break;
        }
    }

    //% block="Boxy Bot|$action"
    //% weight=200
    export function BoxyBot(action: BotAction) {
        
    }

    //% block="Smart Car|$action"
    //% weight=130
    export function SmartCar(action: CarAction) {
        
    }

    //% block="Smart Home|$action"
    //% weight=100
    export function SmartHome(action: HomeAction) {
        
    }

    //% blockId=sonar_ping block="Ultrasonic TRIG %trig|ECHO %echo|unit %unit"
    //% inlineInputMode=inline
    export function Ultrasonic(trig: DigitalPin, echo: DigitalPin, unit: UltrasonicUnit, maxCmDistance = 500): number {
        // send pulse
        pins.setPull(trig, PinPullMode.PullNone);
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);

        // read pulse
        const d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58);

        switch (unit) {
            case UltrasonicUnit.Centimeters: return Math.idiv(d, 58);
            case UltrasonicUnit.Inches: return Math.idiv(d, 148);
            default: return d;
        }
    }

    const PCA9685_ADDRESS = 0x40;
    const MODE1 = 0x00;
    const PRESCALE = 0xfe;
    const LED0_ON_L = 0x06;
    
    let initializedPCA9685 = false;

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function initPCA9685(): void {
        i2cwrite(0x40, 0x00, 0x00);
        setFreq(50);
        for (let idx = 0; idx < 16; idx++) {
            setPwm(idx, 0, 0);
        }
        initializedPCA9685 = true;
    }
    function setFreq(freq: number): void {
        // Constrain the frequency
        let prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        let prescale = prescaleval; //Math.Floor(prescaleval + 0.5);
        let oldmode = i2cread(PCA9685_ADDRESS, MODE1);
        let newmode = (oldmode & 0x7f) | 0x10; // sleep
        i2cwrite(PCA9685_ADDRESS, MODE1, newmode); // go to sleep
        i2cwrite(PCA9685_ADDRESS, PRESCALE, prescale); // set the prescaler
        i2cwrite(PCA9685_ADDRESS, MODE1, oldmode);
        control.waitMicros(5000);
        i2cwrite(PCA9685_ADDRESS, MODE1, oldmode | 0xa1);
    }

    function setPwm(channel: number, on: number, off: number): void {
        if (channel < 0 || channel > 15) return;
        //serial.writeValue("ch", channel)
        //serial.writeValue("on", on)
        //serial.writeValue("off", off)
        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADDRESS, buf);
    }

    function ServoBot(index: Servos, degree: number): void {
        if (!initializedPCA9685) {
            initPCA9685();
        }
        // 50hz: 20,000 us
        let v_us = (degree * 1800) / 180 + 600; // 0.6 ~ 2.4
        let value = (v_us * 4096) / 20000;
        setPwm(index + 7, 0, value);
    }

    function PetRest() {
        ServoBot(Servos.S1, 90);
        ServoBot(Servos.S2, 90);
        ServoBot(Servos.S3, 90);
        ServoBot(Servos.S4, 90);
    }

    function PetSit() {
        PetRest();
        basic.pause(100);
        ServoBot(Servos.S3, 180);
        ServoBot(Servos.S4, 0);
        basic.pause(100);
    }

    function PetSleep() {
        ServoBot(Servos.S1, 0);
        basic.pause(100);
        ServoBot(Servos.S2, 180);
        basic.pause(100);
        ServoBot(Servos.S3, 180);
        basic.pause(100);
        ServoBot(Servos.S4, 0);
        basic.pause(100);
    }

    function PetHello() {
        PetRest();
        basic.pause(100);
        ServoBot(Servos.S3, 180);
        ServoBot(Servos.S4, 0);
        basic.pause(250);
        ServoBot(Servos.S1, 0);
        basic.pause(250);
        let i = 0;
        while (i < 3) {
            ServoBot(Servos.S1, 45);
            basic.pause(200);
            ServoBot(Servos.S1, 0);
            basic.pause(200);
            i++;
        }
        basic.pause(250);
        ServoBot(Servos.S1, 90)
        basic.pause(250);
        ServoBot(Servos.S2, 180)
        basic.pause(250);
        i = 0;
        while (i < 3) {
            ServoBot(Servos.S2, 180);
            basic.pause(200);
            ServoBot(Servos.S2, 135);
            basic.pause(200);
            i++;
        }
        basic.pause(250);
        PetRest();
    }

    function PetWalk() {
        PetRest();
        let i = 0;
        while (i < 10) {
            ServoBot(Servos.S1, 135);
            ServoBot(Servos.S2, 135);
            ServoBot(Servos.S3, 45);
            ServoBot(Servos.S4, 45);
            basic.pause(500);
            ServoBot(Servos.S1, 45);
            ServoBot(Servos.S2, 45);
            ServoBot(Servos.S3, 135);
            ServoBot(Servos.S4, 135);
            basic.pause(500);
            i++;
        }
        PetRest();

    }

    function PetDance() {
        PetRest();
        Dance_1();
        Dance_2();
        Dance_1();
        Dance_3();
        Dance_1();
    }

    function Dance_1() {
        ServoBot(Servos.S1, 45);
        ServoBot(Servos.S2, 135);
        ServoBot(Servos.S3, 135);
        ServoBot(Servos.S4, 45);
        basic.pause(500);
        ServoBot(Servos.S1, 0);
        ServoBot(Servos.S2, 180);
        basic.pause(500);
        let i = 0;
        while (i < 5) {
            ServoBot(Servos.S3, 90);
            ServoBot(Servos.S4, 90);
            basic.pause(500);
            ServoBot(Servos.S3, 135);
            ServoBot(Servos.S4, 45);
            basic.pause(500);
            i++;
        }
        PetRest();
    }

    function Dance_2() {
        let i = 0;
        while (i < 2) {
            ServoBot(Servos.S1, 0);
            ServoBot(Servos.S4, 0);
            basic.pause(500);
            let j = 0;
            while (j < 2) {
                ServoBot(Servos.S2, 90);
                ServoBot(Servos.S3, 45);
                basic.pause(500);
                ServoBot(Servos.S2, 135);
                ServoBot(Servos.S3, 90);
                basic.pause(500);
                j++;
            }
            ServoBot(Servos.S1, 90);
            ServoBot(Servos.S2, 90);
            ServoBot(Servos.S3, 90);
            ServoBot(Servos.S4, 90);
            i++;
        }
    }

    function Dance_3() {
        let i = 0;
        while (i < 2) {
            ServoBot(Servos.S2, 180);
            ServoBot(Servos.S3, 180);
            basic.pause(500);
            let j = 0;
            while (j < 2) {
                ServoBot(Servos.S1, 90);
                ServoBot(Servos.S4, 135);
                basic.pause(500);
                ServoBot(Servos.S1, 45);
                ServoBot(Servos.S4, 90);
                basic.pause(500);
                j++;
            }
            ServoBot(Servos.S1, 90);
            ServoBot(Servos.S2, 90);
            ServoBot(Servos.S3, 90);
            ServoBot(Servos.S4, 90);
            i++;
        }
    }

    function TailWhip() {
        if (Math.randomRange(0,1) == 1) {
            let i = 0;
            while (i < 4) {
                ServoBot(Servos.S5, 20);
                basic.pause(200);
                ServoBot(Servos.S5, 70);
                basic.pause(200);
                i++
            }
            ServoBot(Servos.S5, 45);
        } else {
            basic.pause(1600)
        }
    }
}