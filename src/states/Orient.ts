import BaseState from "./BaseState";
import Agent from '../Agent'
import { Vector3 } from "../utils/misc";

export default class Orient extends BaseState {
    localTarget: Vector3;
    target: Vector3;
    hasJumped: Boolean;
    constructor(agent: Agent, target: Vector3) {
        super(agent, 'ORIENT')
        this.target = target
        this.hasJumped = false
    }
    run() {
        if(this.agent.game.myCar.velocity.z >= 0) this.agent.controller.jump = true
        if(!this.agent.game.myCar.hasWheelContact) {
            
            this.hasJumped = true
            this.localTarget = this.agent.getLocal(this.target)
            this.agent.controller.yaw = this.localTarget.y/3000
        } else if(this.hasJumped) {
            this.finished = true;
        }
    }
}