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

    export enum UltrasonicUnit {
        //% block="μs"
        MicroSeconds,
        //% block="cm"
        Centimeters,
        //% block="inches"
        Inches
    }




    //% block="Calibrate Servo|$first"
    //% weight=300
    export function Calibrate(first: ToyMode) {

    }

    //% block="Robotic Pet|$first"
    //% weight=180
    export function RoboticPet(first: PetAction){
        
    }

    //% block="Boxy Bot|$first"
    //% weight=200
    export function BoxyBot(first: BotAction) {
        
    }

    //% block="Smart Car|$first"
    //% weight=130
    export function SmartCar(first: CarAction) {
        
    }

    //% block="Smart Home|$first"
    //% weight=100
    export function SmartHome(first: HomeAction) {
        
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
}