function levelList() {

levelList.DEFAUL_METHOD = "GET";
levelList.URL_REQUEST = "php/ajax/levellist.php";
levelList.ASYNC_TYPE = true;

levelList.loadData =
	function (){		
		var queryString = "?search=level";

		var url = levelList.URL_REQUEST + queryString;

		var responseFunction = levelList.loadMap;

		AjaxManager.performAjaxRequest(levelList.DEFAUL_METHOD, 
										url, levelList.ASYNC_TYPE, 
										null, responseFunction);
	}

levelList.loadMap= 
	function (data){

		var menu = document.getElementById('menu');
		
		while (menu.firstChild) {
    		menu.removeChild(menu.firstChild);
		}
		
		for (var i = data.length - 1; i >= 0; i--) {

			var row = document.createElement("DIV");
			row.setAttribute("class","level-selector");


			var button = document.createElement("input");
			button.type="button";
			button.value = "play";
    		button.setAttribute('onclick', "levelLoader('" + data[i]['mapId'] + "')"); // for FF
			row.appendChild(button);

			if(data[i]['can_delete']=='1'){
				var button = document.createElement("input");
				button.type="button";
				button.value = "modify";
	    		button.setAttribute('onclick', onclick="location.href='./mapCreator.php?mapId="+ data[i]['mapId'] +"';"); // for FF
				row.appendChild(button);

				var button = document.createElement("input");
				button.type="button";
				button.value = "delete";
	    		button.setAttribute('onclick', "levelUpload('delete','" + data[i]['mapId'] + "')"); // for FF
				row.appendChild(button);
			}

			var title = document.createElement("h1");
			row.appendChild(title);
			title.innerHTML = "Title:" + data[i]['title'];

			var rated = document.createElement("h2");
			row.appendChild(rated);
			rated.innerHTML = "Max Score:" + data[i]['max'];

			var rated = document.createElement("h2");
			row.appendChild(rated);
			rated.innerHTML = "Score:" + data[i]['score'];

			var username = document.createElement("footer");
			row.appendChild(username);
			username.innerHTML = "Creator:" + data[i]['username'];

			var released = document.createElement("footer");
			row.appendChild(released);
			released.innerHTML = "Released:" + data[i]['released'];

			

			menu.appendChild(row);
		};

	}


levelList.loadData();

}

