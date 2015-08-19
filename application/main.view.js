sap.ui.jsview("application.main", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf application.main
	*/ 
	getControllerName : function() {
		return "application.main";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf application.main
	*/ 
	createContent : function(oController) {		
		var splitApp = new sap.m.SplitApp("citSplitApp");
		oController.splitApp = splitApp;
		
		//load master mView
		var masterView = citApp.getNavigation().loadNewView("application.master.master");
		splitApp.addMasterPage(masterView);
				
		return splitApp;
	}
});



