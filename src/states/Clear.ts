import BaseState from "./BaseState"
import Agent from "../Agent"
import DriveTo from "./DriveTo";
import { Vector3 } from "../utils/misc";
import BallShot from "./BallShot";
import { Color } from "rlbotjs";


export default class Clear extends BaseState {
    stage: number;
    constructor(agent: Agent) {
        super(agent, 'GOALSHOT')
    }
    run() {
        if(this.substate && this.substate.finished) this.substate = null

        if(this.substate == null) {
           // console.log(this.agent.game.myCar.team, this.agent.game.teamMult)
           // console.log(this.agent.game.ball.position.y*this.agent.game.teamMult+500, this.agent.game.myCar.position.y)

            if(this.agent.game.ball.position.y*this.agent.game.teamMult-1000 < this.agent.game.myCar.position.y*this.agent.game.teamMult) {
                this.stage = 1
                let minY = this.agent.game.ball.position.y*this.agent.game.teamMult-1000

                let location = new Vector3(0, minY*this.agent.game.teamMult, 0)
                if(minY < -5120) minY = -5120
                if(minY > 5120) minY = 5120


                
                this.substate = new DriveTo(this.agent, location)
                this.agent.addState(this.substate)
            } else {
                this.stage = 0

                this.substate = new BallShot(this.agent)
                this.agent.addState(this.substate)
            }
        }
        
    }
}