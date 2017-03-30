_g = { chapter : 1 , timeout : 0 };

moduLoad.ready = function() {

	bindStartup();
	bindSides();

}

bindStartup = function() {

	$(".startupEntry").click(function() {
	
		chooseStartup($(this).text());
	
	});

}

bindSides = function() {

	$("#goLeft").click(function() {
	
		if (_g.timeout == 0) {
			if (_g.chapter > 1) {
				_g.chapter--;
				fetchComic();
				window.scrollTo(0,0);
				_g.timeout = 1;
				setTimeout(function() { _g.timeout = 0; }, 2000);
			}
		}
		
	});
	
	$("#goRight").click(function() {
		if (_g.timeout == 0) {
			_g.chapter++;
			fetchComic();
			window.scrollTo(0,0);
			_g.timeout = 1;
			setTimeout(function() { _g.timeout = 0; }, 2000);
		}
	
	});

}

chooseStartup = function(text) {

	$("#startupMenu").css("display","none");
	text = text.toLowerCase();
	text = text.replace(" ","-");
	_g.comic = text;
	fetchComic();
	$("#goLeft").css("display","block");
	$("#goRight").css("display","block");

}

fetchComic = function() {

	$("img").remove();
	fetchPage("http://www.readcomics.tv/images/manga/"+_g.comic+"/", _g.chapter, 1);

}

fetchPage = function(url, chapter, page, failed) {

	if (chapter != _g.chapter) { return; }

	failed = failed || 0;

	if (failed > 1) { return; }
	
	var img = document.createElement("img");
	img.onload = function() { fetchPage(url, chapter, page+1, 0); }
	img.onerror = function() { fetchPage(url, chapter, page+1, failed+1); $(this).css("display","none"); }
	img.src = url+chapter+"/"+page+".jpg";
	
	document.getElementById("content").appendChild(img);
	
	$("#goLeft").css("height",$(document).height());
	$("#goRight").css("height",$(document).height());
	
}