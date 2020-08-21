import { 
    BaseAgent, 
    SimpleController, 
    FieldInfo,
    GameTickPacket,
    BallPrediction,
    Color
} from 'rlbotjs';
import { dot } from 'mathjs';

import { Game } from './utils/preprocessing'

import { Vector3, Orientation, Rotator } from './utils/misc'
import Clear from './states/Clear'
import Orient from './states/Orient'
import BaseState from './states/BaseState'
import DriveTo from './states/DriveTo';
import Stabilize from './states/Stabilize';

export default class Agent extends BaseAgent {
    controller: SimpleController;
    game: Game;
    lastSecond: number;
    stateStack: BaseState[];
    constructor(name: string, team: number, index: number, fieldInfo: FieldInfo) {
        super(name, team, index, fieldInfo) 
        this.controller = new SimpleController()
        this.game = new Game(fieldInfo)
        
        this.lastSecond = 0

        this.stateStack = [new DriveTo(this, new Vector3(0, 0, 0))]
    }
    getOutput(gameTickPacket: GameTickPacket, ballPrediction: BallPrediction) {
        this.preprocessing(gameTickPacket, ballPrediction)

        console.log('sup')
        this.runStateStack()

        return this.controller
    }
    checkOverridingStates() {
        let myCar = this.game.myCar

        if((Math.round(myCar.rotation.pitch*10)/10 != 0 || Math.round(myCar.rotation.roll*10)/10 != 0) && !(this.stateStack[this.stateStack.length-1] instanceof Stabilize)) {
            console.log('stabilizing')
            this.stateStack.push(new Stabilize(this))
            return
        }

        if(this.game.ball.latestTouch != undefined)
            if(this.game.gameInfo.secondsElapsed-this.game.ball.latestTouch.gameSeconds < 1) this.stateStack.splice(0, 1)
    }
    addState(state: BaseState) {
        this.stateStack.push(state)
    }
    findNewState() {
        return new Clear(this)
    }
    preprocessing(gameTickPacket: GameTickPacket, ballPrediction: BallPrediction) {
        this.controller = new SimpleController()
        
        this.game.loadPacket(gameTickPacket, ballPrediction, this.index)
        if(this.lastSecond == this.game.gameInfo.secondsElapsed) return this.controller


        this.lastSecond = this.game.gameInfo.secondsElapsed
    }
    runStateStack() {
        
        if(this.game.ball.latestTouch && (this.game.gameInfo.secondsElapsed-this.game.ball.latestTouch.gameSeconds < 0.1)) {
            this.stateStack = []
        }
        
        if(this.stateStack.length == 0) {
            this.stateStack.push(this.findNewState())
        }

        console.log(this.game.myCar.team, this.stateStack.map(s => s.type))

        this.stateStack[this.stateStack.length-1].run()

        if(this.stateStack[this.stateStack.length-1].finished) this.stateStack.pop()
    }

    getLocal(target: Vector3): Vector3 {
        let center: Vector3 = this.game.myCar.position
        let rotation: Rotator = this.game.myCar.rotation

        let orientation = new Orientation(rotation)
        let x = dot(target.subtract(center).convertToArray(), orientation.forward.convertToArray())
        let y = dot(target.subtract(center).convertToArray(), orientation.right.convertToArray())
        let z = dot(target.subtract(center).convertToArray(), orientation.up.convertToArray())
        return new Vector3(x, y, z)
    }
}