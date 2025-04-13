sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "dw/fiori/trng/lyg03/model/Formatter",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/Text",
    "sap/m/ColumnListItem",
    "sap/m/Label",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/ObjectStatus",
	'sap/ui/comp/smartvariants/PersonalizableInfo',
    "sap/ui/core/UIComponent"
], (Controller,
    JSONModel,
    Formatter,
    Dialog,
    Button,
    mobileLibrary,
    List,
    StandardListItem,
    Table,
    Column,
    Text,
    ColumnListItem,
    Label,
    Filter,
    FilterOperator,
    MessageBox,
    ObjectStatus,
    PersonalizableInfo,
    UIComponent) => {
    "use strict";
    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;
    return Controller.extend("dw.fiori.trng.lyg03.controller.List", {
        formatter: Formatter,
        onInit() {
            this._oI18n = this.getOwnerComponent().getModel("i18n");
            // this._oJSONModel = this.getOwnerComponent().getModel();
            const oData = {
                Unit: "EUR",
                editBtnState: false,
                aSelectedContextPath: [],
                selectedItems: [],
                selectedItem: {},
                editDialogTitle: "",
                oNewProduct: {
                    "ID": null,
                    "Name": "",
                    "Description": "",
                    "ReleaseDate": new Date(),
                    "DiscontinuedDate": null,
                    "Rating": null,
                    "Price": ""
                }
            };
            this._oViewModel = new JSONModel(oData);
            this.getView().setModel(this._oViewModel, "viewModel");
			this.oFilterBar = this.getView().byId("filterbar");
			this.oTable = this.getView().byId("idProductsList");

            // this.applyData = this.applyData.bind(this);
			// this.fetchData = this.fetchData.bind(this);
			// this.getFiltersWithValues = this.getFiltersWithValues.bind(this);
			// this.oSmartVariantManagement = this.getView().byId("svm");
			// this.oExpandedLabel = this.getView().byId("expandedLabel");
			// this.oSnappedLabel = this.getView().byId("snappedLabel");
			// this.oFilterBar.registerFetchData(this.fetchData);
			// this.oFilterBar.registerApplyData(this.applyData);
			// this.oFilterBar.registerGetFiltersWithValues(this.getFiltersWithValues);

			// var oPersInfo = new PersonalizableInfo({
			// 	type: "filterBar",
			// 	keyName: "persistencyKey",
			// 	dataSource: "",
			// 	control: this.oFilterBar
			// });
			// this.oSmartVariantManagement.addPersonalizableControl(oPersInfo);
			// this.oSmartVariantManagement.initialise(function () {}, this.oFilterBar);
            
        },

        /**
         * @override
         */
        onAfterRendering: function () {
            //  let oSorter = new sap.ui.model.Sorter("ProductName", false, false, function(a, b) {
            //    return b.length - a.length; // 自定义比较逻辑
            //  });
            let fnGroup = function (oContext) {
                let price = oContext.getProperty("Price");
                return price > 20 ? "High" : "Low";
            };
            let oSorter = new sap.ui.model.Sorter("Price", false, fnGroup);
            // const oList = this.byId("idProductsList");
            this.oTable.getBinding("items").sort(oSorter);
        },

        onExit: function() {
            this._oI18n = null;
            this._oViewModel = null;
			this.oFilterBar = null;
			this.oTable = null;
		},

		// fetchData: function () {
		// 	var aData = this.oFilterBar.getAllFilterItems().reduce(function (aResult, oFilterItem) {
		// 		aResult.push({
		// 			groupName: oFilterItem.getGroupName(),
		// 			fieldName: oFilterItem.getName(),
		// 			fieldData: oFilterItem.getControl().getSelectedKeys()
		// 		});

		// 		return aResult;
		// 	}, []);

		// 	return aData;
		// },

		// applyData: function (aData) {
		// 	aData.forEach(function (oDataObject) {
		// 		var oControl = this.oFilterBar.determineControlByName(oDataObject.fieldName, oDataObject.groupName);
		// 		oControl.setSelectedKeys(oDataObject.fieldData);
		// 	}, this);
		// },

		// getFiltersWithValues: function () {
		// 	var aFiltersWithValue = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
		// 		var oControl = oFilterGroupItem.getControl();

		// 		if (oControl && oControl.getSelectedKeys && oControl.getSelectedKeys().length > 0) {
		// 			aResult.push(oFilterGroupItem);
		// 		}

		// 		return aResult;
		// 	}, []);

		// 	return aFiltersWithValue;
		// },

        onSelectionChange: function (oEvent) {
			// this.oSmartVariantManagement.currentVariantSetModified(true);
			this.oFilterBar.fireFilterChange(oEvent);
		},

		onSearch: function () {
			var aTableFilters = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
				var oControl = oFilterGroupItem.getControl(),
					aSelectedKeys = oControl.getSelectedKeys(),
					aFilters = aSelectedKeys.map(function (sSelectedKey) {
						return new Filter({
							path: oFilterGroupItem.getName(),
							operator: FilterOperator.EQ,
							value1: sSelectedKey
						});
					});

				if (aSelectedKeys.length > 0) {
					aResult.push(new Filter({
						filters: aFilters,
						and: false
					}));
				}

				return aResult;
			}, []);

			this.oTable.getBinding("items").filter(aTableFilters, "Application");
			this.oTable.setShowOverlay(false);
		},

		onFilterChange: function () {
			this._updateLabelsAndTable();
		},

		// onAfterVariantLoad: function () {
		// 	this._updateLabelsAndTable();
		// },

		// getFormattedSummaryText: function() {
		// 	var aFiltersWithValues = this.oFilterBar.retrieveFiltersWithValues();

		// 	if (aFiltersWithValues.length === 0) {
		// 		return "No filters active";
		// 	}

		// 	if (aFiltersWithValues.length === 1) {
		// 		return aFiltersWithValues.length + " filter active: " + aFiltersWithValues.join(", ");
		// 	}

		// 	return aFiltersWithValues.length + " filters active: " + aFiltersWithValues.join(", ");
		// },

		// getFormattedSummaryTextExpanded: function() {
		// 	var aFiltersWithValues = this.oFilterBar.retrieveFiltersWithValues();

		// 	if (aFiltersWithValues.length === 0) {
		// 		return "No filters active";
		// 	}

		// 	var sText = aFiltersWithValues.length + " filters active",
		// 		aNonVisibleFiltersWithValues = this.oFilterBar.retrieveNonVisibleFiltersWithValues();

		// 	if (aFiltersWithValues.length === 1) {
		// 		sText = aFiltersWithValues.length + " filter active";
		// 	}

		// 	if (aNonVisibleFiltersWithValues && aNonVisibleFiltersWithValues.length > 0) {
		// 		sText += " (" + aNonVisibleFiltersWithValues.length + " hidden)";
		// 	}

		// 	return sText;
		// },

		_updateLabelsAndTable: function () {
			// this.oExpandedLabel.setText(this.getFormattedSummaryTextExpanded());
			// this.oSnappedLabel.setText(this.getFormattedSummaryText());
			this.oTable.setShowOverlay(true);
		},

        // onSayHelloPress: function () {
        //   const oResourceBundle = this._oI18n.getResourceBundle();
        //   let sRecipientName = this._oJSONModel.getProperty("/recipient/name");
        //   let sMsg = oResourceBundle.getText("helloMsg", [sRecipientName]);
        //   MessageToast.show(sMsg);
        // },

        onOpenDialogButtonPress: function () {
            sap.m.MessageToast.show("Footer button pressed!");
        },

        onCloseButtonPress: function (oEvent) {
            // this._oCreationDialog.close();
            let oCloseBtn = oEvent.getSource();
            oCloseBtn.getParent().close();
            // this.getView().byId("idhelloDialog").close();
        },

        onCreateButtonPress: function(oEvent) {
            this.oInitProductClone = Object.assign({}, this._oViewModel.getProperty("/oNewProduct"));
			if (!this._oDialog) {
                this._oDialog = this.loadFragment({
                    name: "dw.fiori.trng.lyg03.fragment.CreateionDialog",
                });
            }
            this._oDialog.then(
                function (oDialog) {
                    this._oCreationDialog = oDialog;
                    oDialog.open();
                }.bind(this)
            );
		},

        onSubmitButtonPress: function () {
            let oData = this._oViewModel.getProperty("/oNewProduct");
            this._oCreationDialog.setBusy(true);
            this.getView().getModel().create("/Products", oData, {
                headers: {
					"Content-ID": 1
				},
                groupId: "productCreation",
                success: function (oData) {
                    this._oCreationDialog.setBusy(false);
                    this._oCreationDialog.close();
                    sap.m.MessageToast.show("Product created.");
                }.bind(this),
                error: function (error) {
                    this._oCreationDialog.setBusy(false);
                    sap.m.MessageBox.error("Product creation failed.");
                }.bind(this)
            });
        },

        onDialogAfterClose: function () {
            this._oViewModel.setProperty("/oNewProduct", this.oInitProductClone);
        },

        onDeleteButtonPress: function () {
            MessageBox.confirm("Are you sure to delete the selected Product(s)?", {
                onClose: function (sAction) {
					if (sAction === "OK") {
                        this._executeDeleteProduct();
                    };
				}.bind(this)
            });
        },

        _executeDeleteProduct: function () {            
            const oDataModel = this.getView().getModel();
            let aSelectedItemCtxPath = this._oViewModel.getProperty("/aSelectedContextPath");
            let aDeferredGroups = this.removeDeferredGroupId(["delPrd"], oDataModel);
			if (aDeferredGroups.indexOf("delPrd") === -1) {
                aDeferredGroups = aDeferredGroups.concat(["delPrd"]);
			}
			oDataModel.setDeferredGroups(aDeferredGroups);
            aSelectedItemCtxPath.forEach(function (sPath, idx) {
                oDataModel.remove(sPath, {
                    headers: {
                        "Content-ID": idx + 1
                    },
                    groupId: "delPrd"
                });
            });
            this.oView.setBusy(true);
			oDataModel.submitChanges({
				success: function(oData) {
					this.oView.setBusy(false);
					sap.m.MessageToast.show("Product item(s) deletion successfully.")
				}.bind(this),
				error: function(error) {
					this.oView.setBusy(false);
					sap.m.MessageBox.error("Product item(s) deletion failed.");
				}.bind(this)
			});            
        },

        removeDeferredGroupId: function(aId, oModel) {
			var oDataModel = oModel ? oModel : this.getOwnerComponent().getModel();
			var aDeferredGroups = oDataModel.getDeferredGroups();
			aId.map(function(sId) {
				if (aDeferredGroups.indexOf(sId) !== -1) {
					aDeferredGroups.splice(aDeferredGroups.indexOf(sId), 1);
				}
			});
			return aDeferredGroups;
		},

        onProductsListSelectionChange: function (oEvent) {
            let oSource = oEvent.getSource();
            let aSelectedContextPath = oSource.getSelectedContextPaths();
            let aSelectedItem = oSource.getSelectedItems();
            this._oViewModel.setProperty(
                "/editBtnState",
                aSelectedItem.length === 1
            );
            this._updateSelectedItem2Model(aSelectedContextPath);
        },

        _updateSelectedItem2Model: function (aPath) {
            let aSelectedItem = [];
            let oProductModel = this.getView().getModel();
            this._oViewModel.setProperty("/aSelectedContextPath", aPath);
            aPath.forEach((path) => {
                aSelectedItem.push(oProductModel.getProperty(path));
            }, this);
            this._oViewModel.setProperty("/selectedItems", aSelectedItem);
            this._oViewModel.setProperty("/selectedItem", aSelectedItem[0]);
        },

        onEditButtonPress: function (oEvent) {
            let oResourceBundle = this._oI18n.getResourceBundle();
            let oSelectedItem = Object.assign({}, this._oViewModel.getProperty("/selectedItems")[0]);
            let sPath = this._oViewModel.getProperty("/aSelectedContextPath")[0];
            this._oViewModel.setProperty("/selectedItem", oSelectedItem);
            let sDialogTitle = oResourceBundle.getText("editDialogTitle", [
                this._oViewModel.getProperty("/selectedItem/ProductName"),
            ]);
            this._oViewModel.setProperty("/editDialogTitle", sDialogTitle);
            if (!this._oEditDialog) {
                this._oEditDialog = this.loadFragment({
                    name: "dw.fiori.trng.lyg03.fragment.EditProductDialog",
                });
            }
            this._oEditDialog.then(
                function (oDialog) {
                    oDialog.bindElement({
                        path: sPath
                    });
                    this._oEditProductDialog = oDialog;
                    oDialog.open();
                }.bind(this)
            );
        },

        onSubmitStockQtyPress: function () {
            let oInput = this.getView().byId("idRatingInput");
            if (!this._validateInput(oInput)) {
                this._handleSaveData2EntitySet();
            } else {
                MessageBox.alert(
                    this._oI18n.getResourceBundle().getText("qtyInStockValidTxt")
                );
            }
        },

        _handleSaveData2EntitySet: function() {
			let sPath = this._oViewModel.getProperty("/aSelectedContextPath")[0],
                oObject = this._oEditProductDialog.getBindingContext().getProperty();
			let { Category, Supplier, ...oFinalObj } = oObject;
			this._oEditProductDialog.setBusy(true);
			this.getView().getModel().update(sPath, oFinalObj, {
				headers: {
					"Content-ID": 1
				},
				groupId: "updatePrdInfo",
				success: function(oRes) {
					this._oEditProductDialog.setBusy(false);
					this._oEditProductDialog.close();
					sap.m.MessageToast.show("Update Product info info successfully.");
				}.bind(this),
				error: function(error) {
					this._oEditProductDialog.setBusy(false);
					sap.m.MessageBox.error("Update Product info failed.");
				}.bind(this)
			});
		},

        // onDialogEditBeforeOpen: function (oEvent) {
        //     // let oEvt = oEvent;
        //     let oInput = this.byId("idRatingInput");
        //     let sValueState = oInput.getValueState();
        //     if (sValueState == "Error") {
        //         this.byId("idRatingInput").fireChange();
        //     }
        // },

        onFilterProducts: function (oEvent) {
            // build filter array
            const aFilter = [];
            const sQuery = oEvent.getParameter("query");
            if (sQuery) {
                // aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
                aFilter.push(
                    new Filter({
                        filters: [
                            new Filter({
                                path: "Name",
                                operator: FilterOperator.Contains,
                                value1: sQuery,
                            }),
                            new Filter({
                                path: "Description",
                                operator: FilterOperator.Contains,
                                value1: sQuery,
                            }),
                        ],
                        and: false,
                    })
                );
            }
            // filter binding
            const oList = this.byId("idProductsList");
            const oBinding = oList.getBinding("items");
            oBinding.filter(aFilter, "Control");
        },

        onUnitsInStockInputChange: function (oEvent) {
            let oInput = oEvent.getSource();
            this._validateInput(oInput);
        },

        _validateInput: function (oInput) {
            let reg = /^(0|[1-9]\d*)$/,
                sValueState = "None",
                bValidationError = false;
            if (!reg.test(oInput.getValue()) || oInput.getValue().length == 0) {
                sValueState = "Error";
                bValidationError = true;
            }
            oInput.setValueState(sValueState);
            return bValidationError;
        },

        getRouter : function () {
			return UIComponent.getRouterFor(this);
		},

        onColumnListItemPress: function (oEvent) {
            // sap.m.MessageToast.show("Navigating");
            let oBindingContext = oEvent.getSource().getBindingContext();
            let oPressData = oBindingContext.getObject();
			this.getRouter().navTo("Detail", {
				"ProductID": oPressData.ID
			});
            // sap.m.MessageToast.show("ProductID: " + oPressData.ProductID);
        }
    });
});