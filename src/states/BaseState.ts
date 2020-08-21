import { BaseAgent, GameTickPacket } from "rlbotjs";
import Agent from "../Agent";

export default class BaseState {
    timer: number;
    startTime: number;
    finished: boolean;
    agent: Agent;
    substate: BaseState | null;
    type: string;
    constructor(agent: Agent, type: string) {
        this.timer = 0
        this.startTime = agent.game.gameInfo ? agent.game.gameInfo.secondsElapsed : 0
        this.finished = false
        this.agent = agent
        this.finished = false;
        this.type = type;
    }
    run(...args: any) {

    }
    _run() {
        this.timer = this.agent.game.gameInfo.secondsElapsed-this.startTime
    }
}
