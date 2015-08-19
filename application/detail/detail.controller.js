sap.ui.controller("application.detail.detail", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf application.detail.detail
*/
	onInit: function() {
		detailController = this;
		detailController.getView().addEventDelegate({
			onBeforeShow: function(evt) {
				detailController.onBeforeShow(evt);
			}
		});
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf application.detail.detail
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf application.detail.detail
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf application.detail.detail
*/
//	onExit: function() {
//
//	}
	
	onBeforeShow: function(evt){
		detailController.readExpenseItems();
	},	
	
	readExpenseItems: function(){
		var oData = sap.ui.getCore().getModel("expenseModel").getData();
		var URI = "ExpenseSet(EmployeeNumber='"+oData.EmployeeNumber+"',ExpenseYear='"+oData.ExpenseYear+"',ExpenseMonth='"+oData.ExpenseMonth+"')/ExpenseItemSet";
		citApp.getEAO("main").read(URI, detailController.fnReadExpenseItemsCallback, oData);
	},

	fnReadExpenseItemsCallback: function(oResponse){
		if(oResponse.statusCode === 200){
			//Success
			if(oResponse.model.results.length > 0){
				oExpenseItems = oResponse.model;
				oExpenseItemsModel = new sap.ui.model.json.JSONModel(oExpenseItems);
				detailController.getView().setModel(oExpenseItemsModel);	
			}else{
				//No results
			}
		}else{
			//Error
		}
	},
	
	onDetailSelect: function(evt){
		
	},
	
	onAddExpenseItem: function(evt){
		//navigate to add expense page
		citApp.getNavigation().toDetailPage("application.detail.AddExpenseItem", null);
	},
	
	onSubmitExpenseRequest: function(evt){
		
	}

});