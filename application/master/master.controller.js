sap.ui.controller("application.master.master", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf application.master.master
*/
	onInit: function() {
		masterController = this;
		masterController.getView().addEventDelegate({
			onBeforeShow: function(evt) {
				masterController.onBeforeShow(evt);
			}
		});
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf application.master.master
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf application.master.master
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf application.master.master
*/
//	onExit: function() {
//
//	}
	
	onBeforeShow: function(evt){
		//read "Me" entity
		var URI = "Me";
		citApp.getEAO("main").read(URI, masterController.fnReadMeCallback);
	},
	
	fnReadMeCallback: function(oResponse){
		if(oResponse.statusCode === 200){
			//Success
			var userMe = oResponse.model;
			meDataModel = new sap.ui.model.json.JSONModel(userMe);
			sap.ui.getCore().setModel(meDataModel, "userModel");			
			//expand on ExpenseSet for "Me" or "Logged in User"
			var URI = "EmployeeSet('"+ userMe.EmployeeNumber +"')/ExpenseSet";
			citApp.getEAO("main").read(URI, masterController.fnReadExpensesCallback);			
		}else{
			//Error
		}
	},
	
	fnReadExpensesCallback: function(oResponse){
		if(oResponse.statusCode === 200){
			//Success
			if(oResponse.model.results.length > 0){
				oExpenseSet = oResponse.model;
				oExpenseSetModel = new sap.ui.model.json.JSONModel(oExpenseSet);
				masterController.getView().setModel(oExpenseSetModel);				
			}else{
				//No results
			}			
		}else{
			//Error
		}
	},
	
	onSearch: function(evt){
		//Search Method
	},
	
	onSelect: function(evt){
		var oData = evt.getSource().getSelectedItem().getBindingContext().getObject();
		oExpenseData = new sap.ui.model.json.JSONModel(oData);
		sap.ui.getCore().setModel(oExpenseData, "expenseModel");
		//navigate to detail page with selected data
		citApp.getNavigation().toDetailPage("application.detail.detail", null);
	}

});