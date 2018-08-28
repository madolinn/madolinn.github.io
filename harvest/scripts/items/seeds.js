'use strict';

import { _cv, _g, isWithin } from '../client.js';
import { game } from '../game.js';
import { image } from '../image.js';
import { mapManager } from '../mapManager.js';
import { worldManager } from '../worldManager.js';
import { BaseTool } from './tools.js';

export class BaseSeed extends BaseTool {

	constructor() {
	
		super();
		this.windUp = true;
		
		this.maxStack = 100;
		
		this.name = "A seed";
	
	}

}
