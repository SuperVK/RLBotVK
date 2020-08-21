import BaseState from './BaseState'
import Agent from '../Agent';

export default class Dodge extends BaseState {
    timer: number;
    startTime: number;
    finished: boolean;
    agent: Agent;
    constructor(agent: Agent) {
        super(agent, 'DODGE')
    }
    run() {
        this._run()
        this.agent.controller.boost = false
        if(this.timer <= 0.1) this.agent.controller.jump = true
        else if(this.timer <= 0.2) this.agent.controller.jump = false
        else if(this.timer <= 0.3) {
            this.agent.controller.jump = true    
            this.agent.controller.pitch = -1
        } else if(this.timer >= 1.5) this.finished = true
    }
}

