import { GameTickPacket, Color } from "rlbotjs";
import BaseState from "./BaseState";
import Agent from "../Agent";
import { Vector3 } from '../utils/misc';
import Stabilize from "./Stabilize";
import Dodge from "./Dodge";

export default class DriveTo extends BaseState {
    timer: number;
    startTime: number;
    finished: boolean;
    agent: Agent;
    location: Vector3;
    ETA: number;
    constructor(agent: Agent, location: Vector3, ETA?: number) {
        super(agent, 'DRIVETO')
        this.location = location
        if(ETA) this.ETA = ETA
    }
    run() {

        

        let localPos = this.agent.getLocal(this.location);


        if(Math.abs(localPos.y) < 150) this.agent.controller.boost = true;
         
        if(localPos.y > 100) this.agent.controller.steer = 1
        else if(localPos.y < -100) this.agent.controller.steer = -1
        if(this.ETA != undefined) {
            let lengthToBall = this.agent.game.myCar.position.subtract(this.agent.game.ball.position).getMagnitude()

            let currentETA = this.agent.game.gameInfo.secondsElapsed+(lengthToBall/this.agent.game.myCar.velocity.getMagnitude())


            console.log(localPos.x)
            if(localPos.x < 1000 && localPos.x > 0 && Math.abs(localPos.y) < 100) this.agent.addState(new Dodge(this.agent))

            if(currentETA > this.ETA) this.agent.controller.throttle = 1
            if(this.ETA < this.agent.game.gameInfo.secondsElapsed) this.finished = true
            
            
        } else {
            this.agent.controller.throttle = 1
        }

        if(this.agent.game.myCar.position.subtract(this.location).getMagnitude() < 500) this.finished = true

    }
    checkSubStateAvailability() {
        let myCar = this.agent.game.myCar
        if((Math.round(myCar.rotation.pitch*10)/10 != 0 || Math.round(myCar.rotation.roll*10)/10 != 0)) {
            if(!(this.substate instanceof Stabilize)) {
                console.log('woop')
                this.substate = new Stabilize(this.agent)
            }
        } else {
            this.substate = null;
        }
    } 
}