import BaseState from "./BaseState"
import Agent from "../Agent"


export default class GoalShot extends BaseState {
    constructor(agent: Agent) {
        super(agent, 'GOALSHOT')
    }
    run() {
        
    }
}