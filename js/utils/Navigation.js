function Navigation (sViewType) {
	this.version = "1.5";
	this.splitApp = null;
	this.app = null;
	this.sViewType = sViewType;
}

/**
 * Function to load a new view or existing view.
 * Developers need to make sure that the view is already not a part of the DOM.
 * Also, if a particular view needs to be created more than once, then this function
 * should not be used. Use framework method instead. *
 * @class Navigation
 *
 * @param {String} sPage - Full qualified page name e.g. application.master.mainPage
 * @param {String} sViewType -  data object or null (not mandatory)
 * @return oView - new view created having Id as qualified name of the View, with the passed in View Type
 * @version {@link Navigation}
 */
Navigation.prototype.loadNewView = function (sPage){
	var sId = Util.replaceAllInString(sPage, ".", "_");
	var oView = sap.ui.view({id: sId, viewName:sPage, type:this.sViewType});
	return oView;
};

Navigation.prototype.navigate = function (sToDivId, sFromDivId, oController, oData, sTransition) {
	var oToView = $("#" + sToDivId);
	var oFromView = $("#" + sFromDivId);

	if (oController !== undefined && oController.onBeforeShow) {
		oController.onBeforeShow(oData);
	}
	sTransition = sTransition.toUpperCase();
	if (sTransition == "BACK") {
		oToView.slideDown();
		oFromView.slideUp();
	} else if (sTransition == "TO") {
		oToView.slideDown();
		oFromView.slideUp();
	}
};

/**
 * Function to navigate to a master view page
 * @class Navigation
 *
 * @param {String} sPage - Full qualified page name e.g. application.master.mainPage
 * @param {Object} oData -  data object or null (not mandatory)
 * @return none
 * @version {@link Navigation}
 */
Navigation.prototype.toMasterPage = function (sView, oData, sTransitionName) {
	//check to see if sView already exists in the DOM by replacing . with _
	var sId = Util.replaceAllInString(sView, ".", "_");
	var view = sap.ui.getCore().byId(sId);
	
	if (view === undefined) {
		//load view
		view = this.loadNewView(sView);
		//add view
		this.splitApp.addMasterPage(view);
	}
	
	sTransitionName = this.transitionLookup(sTransitionName);
	
	var evt = {};
    evt.data = oData;
	//In the case where the page is already visible, but we want to re-run the navigation
	if (this.splitApp.getCurrentMasterPage().getId() === sId 
			&& this.splitApp.getCurrentMasterPage().getController().onBeforeShow !== undefined) {
		this.splitApp.getCurrentMasterPage().getController().onBeforeShow(evt);
	} else {
		this.splitApp.toMaster(sId, sTransitionName, evt, null);
	}

};

/**
 * Function to navigate to a detail view page *
 * @class Navigation
 *
 * @param {String} sPage - Full qualified page name e.g. application.detail.mainPage
 * @param {Object} oData -  data object or null (not mandatory)
 * @return none
 * @version {@link Navigation}
 */
Navigation.prototype.toDetailPage = function (sView, oData, sTransitionName) {
	//check to see if sView already exists in the DOM by replacing . with _
	var sId = Util.replaceAllInString(sView, ".", "_");
	var view = sap.ui.getCore().byId(sId);	
	if (view === undefined) {
		//load view
		view = this.loadNewView(sView);
		//add view
		this.getSplitApp().addDetailPage(view);
	}
	sTransitionName = this.transitionLookup(sTransitionName);	
	var evt = {};
	evt.data = oData;
	if (this.getSplitApp().getCurrentDetailPage().getId() === sId 
			&& this.splitApp.getCurrentDetailPage().getController().onBeforeShow !== undefined) {
		this.splitApp.getCurrentDetailPage().getController().onBeforeShow(evt);
	} else {
		this.splitApp.toDetail(sId, sTransitionName, evt, null);
	}
};

/**
 * Function to navigate back to a master view page
 * @class Navigation
 *
 * @param {Object} sView - view created having Id as qualified name of the View 
 * @param {String} oBackData - data object carrying the data user wishes to pass on navigation
 * @return none
 * @version {@link Navigation}
 */
Navigation.prototype.backMasterPage = function (sView, oBackData) {
	if (sView !== undefined) {
		var sId = Util.replaceAllInString(sView, ".", "_");
		this.splitApp.backToPage(sId, oBackData);
	} else {
		this.splitApp.backMaster(oBackData);
	}
};

/**
 * Function to navigate back to a detail view page
 * @class Navigation
 *
 * @param {Object} sView - view created having Id as qualified name of the View
 * @param {String} oBackData - data object carrying the data user wishes to pass on navigation
 * @return none
 * @version {@link Navigation}
 */
Navigation.prototype.backDetailPage = function (sView, oBackData) {
	if (sView !== undefined) {
		var sId = Util.replaceAllInString(sView, ".", "_");
		this.splitApp.backToPage(sId, oBackData);
	} else {
		this.splitApp.backDetail(oBackData);
	}
};

/**
 * Function to navigate forward to any page
 * @class Navigation
 *
 * @param {Object} sPage - view created having Id as qualified name of the View
 * @param {Object} oData -  data object carrying the data user wishes to pass on navigation
 * @param {String} sTransitionName - sting used to pass desired transition
 * @return none
 * @version {@link Navigation}
 */
Navigation.prototype.toPage = function (sPage, oData, sTransitionName) {
	//check to see if sView already exists in the DOM by replacing . with _
	var sId = Util.replaceAllInString(sPage, ".", "_");
	var view = sap.ui.getCore().byId(sId);
	
	if (view === undefined) {
		//load view
		view = this.loadNewView(sPage);
		//add view
		this.app.addPage(view);
	}	
	sTransitionName = this.transitionLookup(sTransitionName);	
	if (this.app.getCurrentPage().getId() === sId 
			&& this.app.getCurrentPage().onBeforeShow !== undefined) {
		var evt = {};
		evt.data = oData;
		this.app.getCurrentPage().getController().onBeforeShow(evt);
	} else {
		this.app.to(sId, sTransitionName, oData, null);
	}
};

/**
 * Function to navigate back to any page
 * @class Navigation
 *
 * @param {Object} sView - view created having Id as qualified name of the View
 * @param {Object} oBackData -  data object carrying the data user wishes to pass on navigation
 * @return none
 * @version {@link Navigation}
 */
Navigation.prototype.backPage = function (oBackData, sView) {
	if (sView !== undefined) {
		var sId = Util.replaceAllInString(sView, ".", "_");
		this.app.backToPage(sId, oBackData);
	} else {
		this.app.back(oBackData);
	}
};

/**
 * Function to provide/detect navigation transition
 * Lookup finds given transition between values fade, flip and show.
 * Default transtion is "slide"
 * @class Navigation
 *
 * @param {String} sTransitionName - sting used to pass desired transition
 * @return none
 * @version {@link Navigation}
 */
Navigation.prototype.transitionLookup = function (sTransitionName) {
	if (sTransitionName != undefined) {
		sTransitionName = sTransitionName.toLowerCase();
		if (sTransitionName !== "fade" && sTransitionName !== "flip" && sTransitionName !== "show") {
			sTransitionName = "slide";
		}
	} else {
		sTransitionName = "slide";
	}
	return sTransitionName;
};

/** Getter & Setter methods
*/
Navigation.prototype.getApp = function () {
	return this.app;
};

Navigation.prototype.setApp = function (app) {
	this.app = app;
};

Navigation.prototype.getSplitApp = function () {
	return this.splitApp;
};

Navigation.prototype.setSplitApp = function (splitApp) {
	this.splitApp = splitApp;
};
