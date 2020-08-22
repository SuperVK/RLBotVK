import { Manager } from 'rlbotjs'
import Agent from './src/Agent'
import * as fs from 'fs';

const manager = new Manager(Agent, Number(fs.readFileSync('./config/port.cfg').toString()), false);
manager.start();
