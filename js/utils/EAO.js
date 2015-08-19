function EAO (domain, bJson, sUsername, sPassword, bIsMobile, oHeader) {
	if(bIsMobile){
		if(sap.m.BusyDialog("busyDialog") === undefined){
			new sap.m.BusyDialog("busyDialog");
		}
	}
	this.version = "1.5";
	this.domain = domain;
	this.bJson = bJson;
	this.sUsername = sUsername;
	this.sPassword = sPassword;
	this.sEndPoint = "";
	this.oServiceModel = null;
	this.sErrorMsg = "";
	this.bIsMobile = bIsMobile;

	// check for local Domain
	this.getServiceUrl(domain);
	this.oServiceModel = new sap.ui.model.odata.ODataModel(this.sEndPoint, bJson, sUsername, sPassword, oHeader);
}


EAO.prototype.requestSentEvent = function(uri) {
	if(this.bIsMobile){
		sap.ui.getCore().byId("busyDialog").open();
	}else{
		sap.ui.core.BusyIndicator.show(0);
	}
};

EAO.prototype.requestCompletedEvent = function (uri) {
	if(this.bIsMobile){
		sap.ui.getCore().byId("busyDialog").close();
	}else{
		sap.ui.core.BusyIndicator.hide();
	}
};

// comment this section only show this if there is a 404
EAO.prototype.requestFailedEvent = function (errMsg) {
	if(this.bIsMobile){
		sap.ui.getCore().byId("busyDialog").close();
	}else{
		sap.ui.core.BusyIndicator.hide();
	}
};

/**
 * Function to get the URL for service end-point *
 * @class EAO
 *
 * @param {String} sBaseUrl - Base URL passed of the application
 * @return {String} sEndPoint - End-point to use in application
 * @version {@link EAO}
 */
EAO.prototype.getServiceUrl = function (sBaseUrl) {
	try{
		if (window.location.hostname === "localhost") {
			//var sOrigin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
			this.sEndPoint = "proxy/" + sBaseUrl.replace("://", "/");
//			if (!jQuery.sap.startsWith(sBaseUrl, sOrigin)) {
//
//			}
			return this.sEndPoint;
		} else {
			this.sEndPoint = sBaseUrl;
			return this.sEndPoint;
		}
	}catch(err){
		this.sErrorMsg = err;
	}
};

/**
 * Function to call sap.ui.model.oData.ODataModel read method, which
 * will trigger a GET to the oData service specified for oServiceModel.
 * This is an asynchronous call and the response will be returned to
 * fnCallback method defined in input parameters. *
 * @class EAO
 *
 * @param {String} sPath - URI to be read
 * @param {Function} fnCallback - Callback method to be called
 * @return none (asynchronous)
 * @version {@link EAO}
 */
EAO.prototype.read = function(sPath, fnCallback, oAdditionalData) {
	this.requestSentEvent(sPath);
	var oResponse = {};
	var that = this;
	this.oServiceModel.read(sPath,
			{
				context : null,
				urlParameters : null,
				async : true,
				success : function (oData, response) {
					that.requestCompletedEvent(sPath);
					oResponse.model = oData;
					oResponse.statusCode = response.statusCode;
					oResponse.statusText = response.statusText;
					oResponse.additionalData = oAdditionalData;
					fnCallback(oResponse);
				},
				error : function (oError) {
					that.sErrorMsg = oError.message;
					that.requestFailedEvent(that.sErrorMsg);
					oResponse.statusCode = oError.response.statusCode;
					oResponse.statusText = oError.response.statusText;
					fnCallback(oResponse);
				}
			}
		);
};

/**
 * Function to call sap.ui.model.oData.ODataModel update method, which
 * will trigger a PUT {merge : false} to the oData service specified for
 * oServiceModel.This is an asynchronous call and the response will be
 * returned to fnCallback method defined in input parameters.
 * @class EAO
 *
 * @param {String} sPath - URI for the update
 * @param {Object} oData - Data object to be updated
 * @param {Function} fnCallback - Callback method to be called
 * @return none (asynchronous)
 * @version {@link EAO}
 */
EAO.prototype.update = function(sPath, oPostData, fnCallback) {
	this.requestSentEvent();
	var oResponse = {};
	var that = this;
	this.oServiceModel.update(sPath, oPostData,
			{
				context : null,
				success : function (oData, response) {
					that.requestCompletedEvent(sPath);
					oResponse.model = oData;
					oResponse.statusCode = response.statusCode;
					oResponse.statusText = response.statusText;
					fnCallback(oResponse);
				},
				error : function (oError) {
					that.sErrorMsg = oError.message;
					that.requestFailedEvent(that.sErrorMsg);
					oResponse.statusCode = oError.response.statusCode;
					oResponse.statusText = oError.response.statusText;
					fnCallback(oResponse);
				},
				merge : false,
				async : true,
				urlParameters : null
			}

	);
};

/**
 * Function to call sap.ui.model.oData.ODataModel update method, which
 * will trigger a MERGE {merge : true} to the oData service specified for
 * oServiceModel.This is an asynchronous call and the response will be
 * returned to fnCallback method defined in input parameters.
 * @class EAO
 *
 * @param {String} sPath - URI for the merge
 * @param {Object} oData - Data object to be merged
 * @param {Function} fnCallback - Callback method to be called
 * @return none (asynchronous)
 * @version {@link EAO}
 */
EAO.prototype.merge = function(sPath, oPostData, fnCallback) {
	this.requestSentEvent();
	var oResponse = {};
	var that = this;
	this.oServiceModel.update(sPath, oPostData,
			{
				context : null,
				success : function (oData, response) {
					that.requestCompletedEvent(sPath);
					oResponse.model = oData;
					oResponse.statusCode = response.statusCode;
					oResponse.statusText = response.statusText;
					fnCallback(oResponse);
				},
				error : function (oError) {
					that.sErrorMsg = oError.message;
					that.requestFailedEvent(that.sErrorMsg);
					oResponse.statusCode = oError.response.statusCode;
					oResponse.statusText = oError.response.statusText;
					fnCallback(oResponse);
				},
				merge : true,
				async : true,
				urlParameters : null
			}
	);
};

/**
 * Function to call sap.ui.model.oData.ODataModel remove method, which
 * will trigger a DELETE {merge : true} to the oData service specified
 * for oServiceModel.This is an asynchronous call and the response will
 * be returned to callback method defined in input parameters.
 * @class EAO
 *
 * @param {String} sPath - URI to be deleted
 * @param {Function} fnCallback - Callback method to be called
 * @return none (asynchronous)
 * @version {@link EAO}
 */
EAO.prototype.remove = function(sPath, fnCallback, oAdditionalData) {
	this.requestSentEvent();
	var oResponse = {};
	var that = this;
	this.oServiceModel.remove(sPath,
			{
				context : null,
				success : function (oData, response) {
					that.requestCompletedEvent(sPath);
					oResponse.model = oData;
					oResponse.statusCode = response.statusCode;
					oResponse.statusText = response.statusText;
					oResponse.additionalData = oAdditionalData;
					fnCallback(oResponse);
				},
				error : function (oError) {
					that.sErrorMsg = oError.message;
					that.requestFailedEvent(that.sErrorMsg);
					oResponse.statusCode = oError.response.statusCode;
					oResponse.statusText = oError.response.statusText;
					fnCallback(oResponse);
				},
				async : true,
				urlParameters : null
			}
	);
};


/**
 * Function to call sap.ui.model.oData.ODataModel remove method, which
 * will trigger a POST to the oData service specified for oServiceModel.
 * This is an asynchronous call and the response will be returned
 * to callback method defined in input parameters.
 * @class EAO
 *
 * @param {String} sPath - URI to be deleted
 * @param {Object} oData - Data object to be created
 * @param {Function} fnCallback - Callback method to be called
 * @return none (asynchronous)
 * @version {@link EAO}
 */
EAO.prototype.create = function(sPath, oPostData, fnCallback, oAdditionalData) {
	this.requestSentEvent(sPath);
	var oResponse = {};
	var that = this;
	this.oServiceModel.create(sPath, oPostData,
			{
				context : null,
				success : function (oData, response) {
					that.requestCompletedEvent(sPath);
					oResponse.model = oData;
					oResponse.statusCode = response.statusCode;
					oResponse.statusText = response.statusText;
					oResponse.additionalData = oAdditionalData;
					fnCallback(oResponse);
				},
				error : function (oError) {
					that.sErrorMsg = oError.message;
					that.requestFailedEvent(that.sErrorMsg);
					oResponse.statusCode = oError.response.statusCode;
					oResponse.statusText = oError.response.statusText;
					oResponse.additionalData = oAdditionalData;
					fnCallback(oResponse);
				},
				async : true,
				urlParameters : null
			}
	);
};

/**
 * Function to call sap.ui.model.oData.ODataModel submitBatch method, which
 * will trigger a $batch - Read on oServiceModel. We are using createBatchOperation
 * method to create an array of batch read operations and add it to another array
 * via addBatchReadOperations method (GET call). This is an asynchronous call and
 * the response will be returned to callback method defined in input parameters.
 * @class EAO
 *
 * @param {String[]} arrSPath - array of read URI to be read
 * @param {Function} fnCallback - Callback method to be called
 * @return none (asynchronous)
 * @version {@link EAO}
 */
EAO.prototype.batchRead = function(arrSPath,fnCallback) {
	var uri = "";
	var arrBatchRead = [];
	if(arrSPath.length>0){
		uri = arrSPath.join();
	}
	this.requestSentEvent(uri);
	var oResponse = {};
	var that = this;
	for(var i=0; i<arrSPath.length; i++){
		arrBatchRead.push(this.oServiceModel.createBatchOperation(arrSPath[i], "GET"));
	}
	this.oServiceModel.addBatchReadOperations(arrBatchRead);
	this.oServiceModel.submitBatch(
		function (oData, response) {
			that.requestCompletedEvent(uri);
			that.oServiceModel.clearBatch();
			oResponse.model = oData;
			oResponse.statusCode = response.statusCode;
			oResponse.statusText = response.statusText;
			fnCallback(oResponse);
		},
		function (oError) {
			that.sErrorMsg= oError.message;
			that.requestFailedEvent(that.sErrorMsg);
			that.oServiceModel.clearBatch();
			oResponse.statusCode = oError.response.statusCode;
			oResponse.statusText = oError.response.statusText;
			fnCallback(oResponse);
		});
};

/**
 * Function to call sap.ui.model.oData.ODataModel submitBatch method, which
 * will trigger a $batch - Create on oServiceModel. We are using createBatchOperation
 * method to create an array of batch post operations and add it to another array
 * via addBatchCreateOperations method (POST call). This is an asynchronous call and
 * the response will be returned to callback method defined in input parameters.
 * @class EAO
 *
 * @param {String[]} arrCreateData - array of post URI and data objects with 1:1 mapping to be posted
 * @param {Function} fnCallback - Callback method to be called
 * @return none (asynchronous)
 * @version {@link EAO}
 */
EAO.prototype.batchCreate = function(arrCreateData,fnCallback) {
	var uri = arrCreateData.uri;
	var arrBatchCreate = [];

	this.requestSentEvent(uri);
	var oResponse = {};
	var that = this;

	for(var i=0; i<arrCreateData.data.length; i++){
		arrBatchCreate.push(this.oServiceModel.createBatchOperation(uri, "POST", arrCreateData.data[i]));
	}

	this.oServiceModel.addBatchChangeOperations(arrBatchCreate);

	this.oServiceModel.submitBatch(
		function (oData, response) {
			that.requestCompletedEvent(uri);
			that.oServiceModel.clearBatch();
			oResponse.model = oData;
			oResponse.statusCode = response.statusCode;
			oResponse.statusText = response.statusText;
			fnCallback(oResponse);
		},
		function (oError) {
			that.sErrorMsg= oError.message;
			that.requestFailedEvent(that.sErrorMsg);
			that.oServiceModel.clearBatch();
			oResponse.statusCode = oError.response.statusCode;
			oResponse.statusText = oError.response.statusText;
			fnCallback(oResponse);
		});
};

/**
 * Function to call sap.ui.model.oData.ODataModel submitBatch method, which
 * will trigger a $batch - Delete on oServiceModel. We are using createBatchOperation
 * method to create an array of batch delete operations and add it to another array
 * via addBatchCreateOperations method (DELETE call). This is an asynchronous call and
 * the response will be returned to callback method defined in input parameters.
 * @class EAO
 *
 * @param {String[]} arrDeleteURI - array of delete URI to be deleted
 * @param {Function} fnCallback - Callback method to be called
 * @return none (asynchronous)
 * @version {@link EAO}
 */
EAO.prototype.batchDelete = function(arrDeleteURI,fnCallback) {
	var uri = "";
	var arrBatchDelete = [];
	if(arrDeleteURI.length>0){
		uri = arrDeleteURI.join();
	}
	this.requestSentEvent(uri);
	var oResponse = {};
	var that = this;
	for(var i=0; i<arrDeleteURI.length; i++){
		arrBatchDelete.push(this.oServiceModel.createBatchOperation(arrDeleteURI[i], "DELETE"));
	}
	this.oServiceModel.addBatchChangeOperations(arrBatchDelete);
	this.oServiceModel.submitBatch(
		function (oData, response) {
			that.requestCompletedEvent(uri);
			that.oServiceModel.clearBatch();
			oResponse.model = oData;
			oResponse.statusCode = response.statusCode;
			oResponse.statusText = response.statusText;
			fnCallback(oResponse);
		},
		function (oError) {
			that.sErrorMsg= oError.message;
			that.requestFailedEvent(that.sErrorMsg);
			that.oServiceModel.clearBatch();
			oResponse.statusCode = oError.response.statusCode;
			oResponse.statusText = oError.response.statusText;
			fnCallback(oResponse);
		});
};
