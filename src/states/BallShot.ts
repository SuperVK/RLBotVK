import BaseState from "./BaseState";
import Agent from "../Agent";
import { Vector3 } from "../utils/misc";
import Orient from "./Orient";
import DriveTo from "./DriveTo";
import { getLocal } from "../utils/misc";
import Stabilize from "./Stabilize";
import { Ball } from "../utils/preprocessing";

export default class BallShot extends BaseState {
    intersectBall: Ball;
    stage: Number;
    stabalizing: Stabilize;
    constructor(agent: Agent) {
        super(agent, 'CLEAR')
        this.intersectBall = null
        this.stage = -1;
    }
    run() {

        if(this.stage == -1) {
            this.stage = 2
                this.intersectBall = this.getIntersectPoint()
            
                if(this.intersectBall == null) {
                    this.intersectBall = this.agent.game.ball
                    this.substate = new DriveTo(this.agent, this.intersectBall.position)
                } else {
                    this.substate = new DriveTo(this.agent, this.intersectBall.position, this.intersectBall.gameSeconds)
                }

                this.agent.addState(this.substate)

                return
        }

        if(this.stage == 0) {
            if(this.agent.game.ball.localPosition.x > 0) {
                
            }

            let localVelocity = getLocal(new Vector3(0,0,0), this.agent.game.myCar.rotation, this.agent.game.myCar.velocity)

            this.agent.controller.throttle = -localVelocity.x
            //console.log(this.agent.game.myCar.velocity.getMagnitude())
            if(this.agent.game.myCar.velocity.getMagnitude() < 250) {
                this.stage = 1;
                this.substate = new Orient(this.agent, this.agent.game.ball.position)
                this.agent.addState(this.substate)
            }
        }

        if(this.stage == 1 && this.substate.finished) {
            this.intersectBall = this.getIntersectPoint()

            if(this.intersectBall == null) this.intersectBall = this.agent.game.ball

            this.substate = new DriveTo(this.agent, this.intersectBall.position, this.intersectBall.gameSeconds)
            this.agent.addState(this.substate)
            this.stage = 2
        }
        
        if(this.stage == 2 && this.substate.finished) this.finished = true
            
        
    }
    getIntersectPoint() {
        let lengthToBall = this.agent.game.myCar.position.subtract(this.agent.game.ball.position).getMagnitude()

        let secondsArriving = lengthToBall/1000

        let futureBall = this.agent.game.ballPredictions.find(b => Math.round(b.gameSeconds) == Math.round(this.agent.game.gameInfo.secondsElapsed+secondsArriving))

        if(futureBall == null) return null

        return this.agent.game.ballPredictions.find(b => Math.round(b.gameSeconds) == Math.round(this.agent.game.gameInfo.secondsElapsed+secondsArriving))
    }
}
