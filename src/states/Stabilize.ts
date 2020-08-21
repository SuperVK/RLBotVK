import BaseState from "./BaseState";
import Agent from "../Agent";
import { ifError } from "assert";


export default class Stabilize extends BaseState {
    timer: number;
    startTime: number;
    agent: Agent;
    jumpedAt: number;
    constructor(agent: Agent) {
        super(agent, 'STABILIZE')
        
    }
    run() {
        
        if(this.timer > 0.1) {
            this.jumpedAt = this.timer
            this.agent.controller.jump = true;
        }

        console.log(this.timer-this.jumpedAt)

        this._run()

        if(this.timer-this.jumpedAt > 0.2) {
            this.jumpedAt = this.timer
            this.agent.controller.jump = false
        }

        let myCar = this.agent.game.myCar;
        
        this.agent.controller.pitch = -myCar.rotation.pitch
        this.agent.controller.roll = -myCar.rotation.roll

        if(this.agent.game.myCar.hasWheelContact && this.timer > 0.6) {
            this.finished = true
            
        }
    }
}