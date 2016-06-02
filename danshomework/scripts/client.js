moduLoad.ready = function() {
	
	binds();
	
}

binds = function() {

	$("button#btn_compute").click(function() {
		compute();
	});
	
}

compute = function() {
	
	var cost = parseFloat($("input#inp_cost").val());
	var fcost = cost;
	
	var shipping = $("input#inp_shipping").prop("checked");
	
	if (fcost <= 150) {
		if (shipping) {
			fcost += 6 + (3*Math.floor(cost/50.01));
		} else {
			fcost += 8 + (4*Math.floor(cost/50.01)) - (1*Math.floor(cost/100.01));
		}
	}
	
	if (shipping) { shipping = "US"; } else { shipping = "Canada"; }
	
	$("div#div_result").html("Total Cost is "+fcost+"$ to "+shipping+".");
	
}