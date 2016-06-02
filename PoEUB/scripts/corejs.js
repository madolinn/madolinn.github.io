var s = document.createElement("script");
var ajax = new XMLHttpRequest();
s.setAttribute("type", "text/javascript");
//s.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js");
ajax.onreadystatechange=function() {
	if (ajax.readyState == 4) {
		if (ajax.status == 200) {
			s.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js");
		} else {
			s.setAttribute("src", "file:///A:/xampp/htdocs/dev/jquery/jquery.min.js");
		}
	}
}
ajax.open("GET","https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js",true);
ajax.send();
s.onload = function () {
    var d = "scripts";
    var m = "client";
    $("script").each(function () {
		if ($(this).attr("src") == undefined) { return; }
        if ($(this).attr("src").substr(-10) == "/corejs.js") {
            d = $(this).attr("dir") || d;
            m = $(this).attr("main") || m;
        }
    });
    _moduLoad = {
        dir: d,
        main: m,
		toLoad : 0,
		loaded : 0
    };
	_moduLoad.info = function(e) {
		var f = [];
		var p = [];
		for (key in window[e]) {
			if (typeof window[e][key] === "function") {
				f.push(key);
			} else {
				p.push(key);
			}
		}
		return ("moduLoad : Info of "+e+"\n   Function List : " + f.join(", ") +"\n   Property List : " + p.join(", "));
	}
	_moduLoad.checkLoad = function(inc) {
		inc = inc || false;
		if (inc) { _moduLoad.loaded++; }
		if (_moduLoad.toLoad == _moduLoad.loaded) { moduLoad.ready(); }
	}
    moduLoad = function (e) {
		var utc = new Date();
		utc = utc.getTime();
        if (typeof e === "string") {
			var a = document.createElement("script");
			a.setAttribute("type", "text/javascript");
			a.setAttribute("src", "./" + _moduLoad.dir + "/" + e + ".js?=" + utc);
			_moduLoad.toLoad++;
			a.onload = function () { if(window.hasOwnProperty(e)) { window[e].info = function () { console.info(_moduLoad.info(e)); }} _moduLoad.checkLoad(true); }
			document.head.insertBefore(a, document.head.lastChild);
        } else if (Array.isArray(e)) {
            for (var i = 0; i < e.length; i++) {
                if (typeof e[i] === "string") {
						var a = document.createElement("script");
						a.setAttribute("type", "text/javascript");
						a.setAttribute("src", "./" + _moduLoad.dir + "/" + e[i] + ".js?=" + utc);
						_moduLoad.toLoad++;
						a.onload = function () { if(window.hasOwnProperty(e)) { window[e[i]].info = function () { console.info(_moduLoad.info(e[i])); }} _moduLoad.checkLoad(true); }
						document.head.insertBefore(a, document.head.lastChild);
                } else {
                    console.group("moduLoad");
                    console.warn(" Index [" + i + "] of array was not a string.");
                    console.trace();
                    console.groupEnd();
                }
            }
        } else {
            console.group("moduLoad");
            console.warn(" Argument was not a string or an array of strings.");
            console.trace();
            console.groupEnd();
        }
    };
	moduLoad.info = function () { console.log(_moduLoad.info("moduLoad")); }
    moduLoad(_moduLoad.main);
};
document.head.insertBefore(s, document.head.firstChild);