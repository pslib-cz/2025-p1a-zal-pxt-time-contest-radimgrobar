enum GameState {
    Passive,
    Started,
    Running
}
let state = GameState.Passive
let targetInterval = 0
let targetMs = 0
let startTime = 0
let score = 0
let reactionTime = 0
function evaluateGame() {
    let tolerance = 250 + (0.1 * targetMs)

    if (reactionTime >= (targetMs - tolerance) && reactionTime <= targetMs) {
        let step = tolerance / 9
        let diff = targetMs - reactionTime
        score = 9 - Math.floor(diff / step)

        if (score > 9) score = 9
        if (score < 1) score = 1

        basic.showIcon(IconNames.Happy)
        music.playMelody("C5 B A G F E D C ", 120)
    } else {
        score = 0
        basic.showIcon(IconNames.Sad)
        music.playTone(131, 500)
    }

    state = GameState.Passive
}
function handleGuess() {
    if (state == GameState.Running) {
        reactionTime = control.millis() - startTime
        evaluateGame()
    }
}
input.onLogoEvent(TouchButtonEvent.Touched, function () {
    handleGuess()
})
input.onButtonPressed(Button.A, function () {
    handleGuess()
})
input.onButtonPressed(Button.AB, function () {
    if (state == GameState.Passive) {
        state = GameState.Started
    }
})
input.onButtonPressed(Button.B, function () {
    if (state == GameState.Passive) {
        basic.showNumber(score)
    }
})
basic.forever(function () {
    if (state == GameState.Started) {
        targetInterval = randint(5, 15)
        targetMs = targetInterval * 1000
        basic.showIcon(IconNames.Pitchfork)
        control.runInBackground(() => music.playTone(440, 200))
        basic.pause(targetMs)
        control.runInBackground(() => music.playTone(880, 200))
        startTime = control.millis()
        state = GameState.Running
        basic.showString("?")
    }
    if (state == GameState.Running) {
        if ((control.millis() - startTime) > (targetMs + 1000)) {
            reactionTime = targetMs + 1001
            evaluateGame()
        }
    }
})
//S prací mi pomáhala AI ale pouze pomáhala, nedělala to celé za mě! Když jsem nevědel jak dál, pomohla mi a navodila mě zpátky na cestu.