gametext = { };

gametext.setText = function(tx) {

	var output;

	if (tx.constructor === Array) {
		
		output = tx[0];
		
		if (tx.length > 1) {
		
			var temp = tx;
			temp.splice(0,1);
			
			$("#game_text_continue").css("display","block");
			$("#game_text_continue").click(function() {
				$(this).off("click");
				$(this).css("display","none");
				gametext.addText(temp);
			});
		
		}
		
		
	} else {
		
		output = tx;

	}
	
	var re = /\[(.+?)\]/gi;
	output = output.replace(re, '<span class = "object">$1</span>');

	$("div#game_text").html(output);	

}

gametext.addText = function(tx) {
	
	var output;

	if (tx.constructor === Array) {
		
		output = tx[0];
		
		if (tx.length > 1) {
		
			var temp = tx;
			temp.splice(0,1);
			
			$("#game_text_continue").css("display","block");
			$("#game_text_continue").click(function() {
				$(this).off("click");
				$(this).css("display","none");
				gametext.addText(temp);
			});
		
		}
		
		
	} else {
		
		output = tx;

	}
	
	var re = /\[(.+?)\]/gi;
	output = output.replace(re, '<span class = "object">$1</span>');

	$("div#game_text").html($("div#game_text").html() + "<br><br>" + output);	
	
}