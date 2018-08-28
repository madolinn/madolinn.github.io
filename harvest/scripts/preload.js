'use strict';

import { image } from "./image.js";
import { _cv } from "./client.js";

var preload = { urls : [
"./scripts/images/6755.png",
"./scripts/images/81458.png",
], imgs : new Array(1000), done : 0 }

preload.start = function() {
	
	for (var i = 0; i < preload.urls.length; i++) {	
	
		image.list[i] = new Image();
		image.list[i].onload = function() { preload.check(); }
		image.list[i].src = preload.urls[i];
	
	}

}

preload.check = function() {

	preload.done++;

	if (preload.done == preload.urls.length) {
	
		for (var i = 0; i < this.urls.length; i++) {
		
			//image.wCV.drawImage(image.list[i],0,0);
			//_cv[0].drawImage(image.list[i],0,0);
		
		}
	
		$(document).trigger("readya");
	
	}

}

export { preload };