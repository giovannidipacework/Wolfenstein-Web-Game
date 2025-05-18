function levelUpload(type,toUpload){

levelUpload.DEFAUL_METHOD = "GET";
levelUpload.URL_REQUEST = "php/ajax/levelUpload.php";
levelUpload.ASYNC_TYPE = false;

levelUpload.loadData =
	function (type,toUpload){

		var queryString;
		switch(type){
			case 'map':
				queryString = "?type=map&title=" + toUpload;
			break;
			case 'delete':
				queryString = "?type=delete&mapId=" + toUpload;
			break;
			case 'wall':
				queryString = "?type=wall&x1=" + toUpload.x1 + "&y1=" + toUpload.y1 + "&x2=" + toUpload.x2 + "&y2=" + toUpload.y2 + "&texture=" + toUpload.offset;
			break;
			case 'wall-interactable':
				queryString = "?type=wall-interactable&x1=" + toUpload.x1 + "&y1=" + toUpload.y1 + "&x2=" + toUpload.x2 + "&y2=" + toUpload.y2 + "&texture=" + toUpload.offset + "&key=" + toUpload.required_key + "&x12=" + toUpload.x12 + "&y12=" + toUpload.y12 + "&x22=" + toUpload.x22 + "&y22=" + toUpload.y22;
			break;
			case 'sprite':
				queryString = "?type=sprite&x=" + toUpload.position.x + "&y=" + toUpload.position.y + "&sprite_type=" + toUpload.type + "&texture=" + toUpload.offset;
			break;
			case 'player':
				queryString = "?type=player&x=" + toUpload.position.x + "&y=" + toUpload.position.y;
			break;
		}

		var url = levelUpload.URL_REQUEST + queryString;
		var responseFunction = levelUpload.responseFunction;

		AjaxManager.performAjaxRequest(levelUpload.DEFAUL_METHOD, 
										url, levelUpload.ASYNC_TYPE, 
										null, responseFunction);
	}

levelUpload.responseFunction =
	function (data){
		console.log(data);
		return data;
	}

levelUpload.search = levelUpload.loadData(type,toUpload);

}