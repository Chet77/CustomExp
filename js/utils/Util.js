var Util = {
		
		/**
		 * @param bundles. Array of resource bundles that have already been loaded
		 */
		bundles : [],
		
		/**
		 * @param lang. This should be overwritten based on the logged in users language
		 * 
		 */
		lang : "EN",
		
		/**
		 * @param defaultResourcePath. This is assigned to the appUrl and can be directly overwritten on page load
		 */
		defaultResourcePath : "",
		
		/**
		 * urlParam:
		 * @param String 
		 * @description Accepts query parameter of URL and uses Regex
		 *  to escape any spaces and forward slashes
		 * @returns String
		**/
		urlParam : function (name) {
			return $.sap.getUriParameters().get(name);
		},

		/**
		 * 
		 * @param text (String) - key for the text required to be returned
		 * @param component (String) - resource file URL to be used 
		 * @description If the component is not supplied, the default resource path is used
		 * @description If the component is supplied, the bundles array is checked to see if it is local, 
		 * @description otherwise retrieve it using the component 
		 * @returns String
		 */
		t : function (text, resPath) {
			
			if (this.lang == null || this.lang == "") {
				this.lang = "EN";
			}
			
			if (resPath == null) {
				resPath = this.defaultResourcePath;
			}
			
			if (this.bundles[resPath] == null) {
				this.bundles[resPath] = jQuery.sap.resources({
					url : "../" + resPath + "/res/i18n.properties",
					locale : this.lang
				});
			}
			
			return this.bundles[resPath].getText(text);
		},
		
		serviceResponseChecker : function (sr) {
			
			var success = true;
			
			if (sr == undefined || sr.model == undefined || sr.statusCode == undefined || sr.statusCode != 200) {
				success = false;
			}
			
			return success;
		},
		
		byId : function (id) {
			return sap.ui.getCore().byId(id);
		},
		
		replaceAllInString : function(sVariable, existingCharacter, newCharacter){
			var sReplacedString =  sVariable;
			for(var i=0;i<sVariable.split(".").length-1;i++){
				sReplacedString = sReplacedString.replace(existingCharacter, newCharacter);
			}
			return sReplacedString;
		}
};