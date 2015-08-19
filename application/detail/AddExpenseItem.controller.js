sap.ui.controller("application.detail.AddExpenseItem", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf application.detail.AddExpenseItem
*/
	onInit: function() {
		addExpItemController = this;
		addExpItemController.getView().addEventDelegate({
			onBeforeShow: function(evt) {
				addExpItemController.onBeforeShow(evt);
			}
		});
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf application.detail.AddExpenseItem
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf application.detail.AddExpenseItem
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf application.detail.AddExpenseItem
*/
//	onExit: function() {
//
//	}
	
	onBeforeShow: function(evt){
		//set up new expense item model
		var newExpenseItem = {
				Detail : {Client: "", Amount: "", Location: "", Date: ""}
		};
		newExpenseItemData = new sap.ui.model.json.JSONModel(newExpenseItem);
		sap.ui.getCore().setModel(newExpenseItemData, "newExpenseItem");	
		
		//set up type model
		addExpItemController.initializeTypeData();
	},
	
	initializeTypeData: function() {
		var URI = "ExpenseTypeSet";
		citApp.getEAO("main").read(URI, addExpItemController.fnReadExpenseTypesCallback);
	},
	
	fnReadExpenseTypesCallback: function(oResponse){
		if(oResponse.statusCode === 200){
			console.log(oResponse.model);			
			if(oResponse.model.results.length > 0){
				var oData = oResponse.model;
				oExpTypeData = new sap.ui.model.json.JSONModel(oData);
				addExpItemController.getView().setModel(oExpTypeData, "expTypesModel");					
			}else{
				//No results
			}
		}else{
			//Error
		}
	},
	
	onSave: function(evt){
		oData = evt.getSource().getBindingContext("newExpenseItem").getObject();
		console.log("Save Pressed");
	}, 
	
	onCancel: function(){
		citApp.getNavigation().backDetailPage("application.detail.detail", null);
	}
});