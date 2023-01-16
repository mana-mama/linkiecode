radio.onReceivedNumber(function (receivedNumber) {
    if (receivedNumber == 11) {
        LINKIECODE.RoboticPet(LINKIECODE.PetAction.Rest)
    } else if (receivedNumber == 13) {
        LINKIECODE.RoboticPet(LINKIECODE.PetAction.Sit)
    } else if (receivedNumber == 14) {
        LINKIECODE.RoboticPet(LINKIECODE.PetAction.Sit)
    } else if (receivedNumber == 22) {
        LINKIECODE.RoboticPet(LINKIECODE.PetAction.Sleep)
    } else if (receivedNumber == 21) {
        LINKIECODE.RoboticPet(LINKIECODE.PetAction.Hello)
    } else if (receivedNumber == 12) {
        LINKIECODE.RoboticPet(LINKIECODE.PetAction.Walk)
    } else if (receivedNumber == 34) {
        LINKIECODE.RoboticPet(LINKIECODE.PetAction.Dance)
    } else if (receivedNumber == 43) {
        LINKIECODE.RoboticPet(LINKIECODE.PetAction.Dance)
    }
})
radio.setGroup(1)
LINKIECODE.Calibrate(LINKIECODE.ToyMode.RoboticPet)
basic.forever(function () {
    LINKIECODE.RoboticPet(LINKIECODE.PetAction.TailWhip)
})
