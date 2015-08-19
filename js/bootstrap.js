var bootstrap = {
		namespaces : [],
		jsFiles :
			[
			 "js.Formatter",
			 "js.utils.DateFormatter",
			 "js.utils.Logger",
			 "js.utils.EAO",
			 "js.utils.Navigation",
			 "js.utils.Util"
			],

		eaoEndpoints : [{name:"main" , URI:"http://q12gw20.eai-ltd.co.uk:8012/sap/opu/odata/CITEXP/EXPENSES_SRV", bJson: false}],	
		cssFiles : [ "css/common.css"],

		//development = "forcedTrue", uat = "true", production = "false"
		debugMode : "forcedTrue",

		//development = info, uat = warn, production = error
		logLevel : "error" //info, warn, debug, error
};
