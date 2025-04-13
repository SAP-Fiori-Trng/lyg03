sap.ui.define(["sap/ui/core/library"], function(coreLibrary) {
	"use strict";
	// shortcut for sap.ui.core.ValueState
	var ValueState = coreLibrary.ValueState;
	return  {
        statusText: function(sStatus) {
			const oI18n = this.getOwnerComponent().getModel("i18n");
			const oResourceBundle = oI18n.getResourceBundle();
			switch (sStatus) {
				case false:
					return oResourceBundle.getText("availableTxt");
				case true:
					return oResourceBundle.getText("notAvailableTxt");
				default:
					return "--";
			}
		},

		jonitDetailTitle: function(title1, title2) {
			if (title1 && title2) {
				return title1 + "-" + title2;
			} else if (title2) {
				return title2;
			} else if (title1) {
				return title2;
			}
			return "";
		},

		/**
		 * Rounds the number unit value to 2 digits
		 * @public
		 * @param {string} sValue the number string to be rounded
		 * @returns {string} sValue with 2 digits rounded
		 */
		numberUnit : function (sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},

		/**
		 * Defines a value state based on the stock level
		 *
		 * @public
		 * @param {number} iValue the stock level of a product
		 * @returns {string} sValue the state for the stock level
		 */
		quantityState: function(iValue) {
			if (iValue === 0) {
				return ValueState.Error;
			} else if (iValue <= 10) {
				return ValueState.Warning;
			} else {
				return ValueState.Success;
			}
		}
	};
});