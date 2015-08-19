var DateFormatter = {
	settings : {
		useResourceFile : false,
		resourceBundle : "",
		weekDays : [
		            "Sunday",
		            "Monday",
		            "Tuesday",
		            "Wednesday",
		            "Thursday",
		            "Friday",
		            "Saturday",
		            "Sunday"
		            ],
		months : [
		          "January",
		          "February",
		          "March",
		          "April",
		          "May",
		          "June",
		          "July",
		          "August",
		          "September",
		          "October",
		          "November",
		          "December"]
	},

	token : /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
	timezone : /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
	timezoneClip : /[^-+\dA-Z]/g,

	pad : function (val, len) {
		val = String(val);
		len = len || 2;
		while (val.length < len) {
			val = "0" + val;
		}
		return val;
	},

	masks : {
		"default" : "ddd mmm dd yyyy HH:MM:ss",
		shortDate : "m/d/yy",
		mediumDate : "mmm d, yyyy",
		longDate : "mmmm d, yyyy",
		fullDate : "dddd, mmmm d, yyyy",
		shortTime : "h:MM TT",
		mediumTime : "h:MM:ss TT",
		longTime : "h:MM:ss TT Z",
		isoDate : "yyyy-mm-dd",
		isoTime : "HH:MM:ss",
		isoDateTime : "yyyy-mm-dd'T'HH:MM:ss",
		edmDateTime : "yyyy-mm-dd'T'HH:MM",
		isoUtcDateTime : "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
	},

	format : function (date, mask, utc) {

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}
		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) {
			throw SyntaxError("invalid date");
		}
		//mask equals the String version of one of the predefined masks OR mask itself OR default from the predefined list
		mask = String(this.masks[mask] || mask || this.masks["default"]);
		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) === "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}
		var _ = utc ? "getUTC" : "get";
		var	d = date[_ + "Date"]();
		var	m = date[_ + "Month"]();
		var	y = date[_ + "FullYear"]();
		var	H = date[_ + "Hours"]();
		var	M = date[_ + "Minutes"]();
		var	s = date[_ + "Seconds"]();
		var	L = date[_ + "Milliseconds"]();
		var	o = utc ? 0 : date.getTimezoneOffset();
		var flags = {
			d : d,
			dd : this.pad(d),
			ddd : this.settings.useResourceFile === true ? Util.t("day" + d, this.settings.resourceBundle).substring(0,3) : this.settings.weekDays[date.getDay()].substring(0,3),
			dddd : this.settings.useResourceFile === true ? Util.t("day" + d, this.settings.resourceBundle) : this.settings.weekDays[date.getDay()],
			m : m + 1,
			mm : this.pad(m + 1),
			mmm : this.settings.useResourceFile === true ? Util.t("month" + m, this.settings.resourceBundle).substring(0,3) : this.settings.months[date.getMonth()].substring(0,3),
			mmmm : this.settings.useResourceFile === true ? Util.t("month" + m, this.settings.resourceBundle) : this.settings.months[date.getMonth()],
			yy : String(y).slice(2),
			yyyy : y,
			h : H % 12 || 12,
			hh : this.pad(H % 12 || 12),
			H : H,
			HH : this.pad(H),
			M : M,
			MM : this.pad(M),
			s : s,
			ss : this.pad(s),
			l : this.pad(L, 3),
			L : this.pad(L > 99 ? Math.round(L / 10) : L),
			t : H < 12 ? "a" : "p",
			tt : H < 12 ? "am" : "pm",
			T : H < 12 ? "A" : "P",
			TT : H < 12 ? "AM" : "PM",
			Z : utc ? "UTC" : (String(date).match(this.timezone) || [ "" ]).pop().replace(this.timezoneClip, ""),
			o : (o > 0 ? "-" : "+") + this.pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
			S : [ "th", "st", "nd", "rd" ][d % 10 > 3 ? 0 : (d % 100 - d % 10 !== 10) * d % 10]
		};
		//iterate & replace the mask (the format that was passed in) based
		//on the regex of "token" to establish if "flags" has the attribute
		//else slice it & return the second element to the end
		return mask.replace(this.token, function($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	},

	/**
	 * @param yyyymmdd : string
	 * @param format : not currently used
	 * @return mydate : Date
	 **/
	parseDate : function (date, format) {
		var year = parseInt(date.substring(0,4));
		var mon = parseInt(date.substring(4,6))-1;
		var day = parseInt(date.substring(6,8));
		var mydate = new Date(year,mon,day);
		return mydate;
	}
};

//For convenience...
Date.prototype.format = function(mask, utc) {
	return DateFormatter.format(this, mask, utc);
};

Date.prototype.getWeekNumber = function(){
    var d = new Date(+this);
    d.setHours(0,0,0);
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));
    return Math.ceil((((d - new Date(d.getFullYear(),0,1)) / 8.64e7) + 1) / 7);
};
