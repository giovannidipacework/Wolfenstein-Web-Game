function levelLoader(toSearch,modify){

levelLoader.DEFAUL_METHOD = "GET";
levelLoader.URL_REQUEST = "php/ajax/levelDownload.php";
levelLoader.ASYNC_TYPE = true;

levelLoader.loadData =
	function (toSearch,modify){
		
		if(!modify)
			document.getElementById("menu").style.display = "none";

		var queryString = "?search=" + toSearch;

		var url = levelLoader.URL_REQUEST + queryString;

		console.log(url);
		var responseFunction = levelLoader.loadMap;

		AjaxManager.performAjaxRequest(levelLoader.DEFAUL_METHOD, 
										url, levelLoader.ASYNC_TYPE, 
										null, responseFunction);
	}

levelLoader.loadMap= 
	function (data){

		var result = data;
		if(result['title'].length == 0){
			console.log("map not found");
			return;
		}
		

		FRAME_COUNT = 0;
		walls = [];
		sprites = [];
		//console.log(data);

		var element = document.getElementsByTagName("audio"), index;

		for (index = element.length - 1; index >= 0; index--) {
		    element[index].parentNode.removeChild(element[index]);
		}


		for (var i = result['walls'].length - 1; i >= 0; i--) {

			var interactable = (result['walls'][i]['key']!=3);

			var wall = new Wall( 
								parseInt(result['walls'][i]['x1']),
								parseInt(result['walls'][i]['y1']),
								parseInt(result['walls'][i]['x2']),
								parseInt(result['walls'][i]['y2']),
								parseInt(result['walls'][i]['texture']),
								);

			if(interactable){
				wall.set_interaction(
								parseInt(result['walls'][i]['key']),
								parseInt(result['walls'][i]['x1_2']),
								parseInt(result['walls'][i]['y1_2']),
								parseInt(result['walls'][i]['x2_2']),
								parseInt(result['walls'][i]['y2_2'])
								);
			}

			walls.push(wall);
		};

		for (var i = result['sprites'].length - 1; i >= 0; i--) {

			var sprite = new Sprite( 
								parseInt(result['sprites'][i]['x']),
								parseInt(result['sprites'][i]['y']),
								result['sprites'][i]['type'],
								parseInt(result['sprites'][i]['texture'])
								);
			
			sprites.push(sprite);
		};

		if(!modify){
			player.position.x = parseInt(result['player_spawn'][0]['x']);
			player.position.y = parseInt(result['player_spawn'][0]['y']);
			player.reset();
		}else{
			player = new Player(parseInt(result['player_spawn'][0]['x']),parseInt(result['player_spawn'][0]['y']));
		}


		level = result['title'][0]['title'];

		if(!modify)
			gameTimer = setInterval(clockFuction, 1000/FRAME_PER_SECOND);
	}


levelLoader.search = levelLoader.loadData(toSearch,modify);

}