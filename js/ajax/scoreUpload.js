function scoreUpload(toUpload){

scoreUpload.DEFAUL_METHOD = "GET";
scoreUpload.URL_REQUEST = "php/ajax/scoreUpload.php";
scoreUpload.ASYNC_TYPE = true;

scoreUpload.loadData =
	function (toUpload){

		queryString = "?score=" + toUpload;

		var url = scoreUpload.URL_REQUEST + queryString;
		var responseFunction = scoreUpload.responseFunction;

		AjaxManager.performAjaxRequest(scoreUpload.DEFAUL_METHOD, 
										url, scoreUpload.ASYNC_TYPE, 
										null, responseFunction);
	}

scoreUpload.responseFunction =
	function (data){
		console.log(data);
	}

scoreUpload.search = scoreUpload.loadData(toUpload);

}