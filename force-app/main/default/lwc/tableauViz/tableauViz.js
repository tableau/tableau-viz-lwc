import { LightningElement, api, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import tableauJSAPI from '@salesforce/resourceUrl/tableauJSAPI';
import { reduceErrors } from './errorUtils.js';

import templateMain from './tableauViz.html';
import templateError from './tableauVizError.html';

export default class TableauViz extends LightningElement {
//#region Member Variables
//#region Special LWC variable
    // https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.use_context
    @api objectApiName
    @api recordId
//#endregion Special LWC variable

//#region Filter variables
    // Need to maintain an independent list that wire service can react to changes on
    _recordFilterFields = []
    _recordFilters = new Map()
    _recordFiltersResolved = true // If there are no fields, then they are resolved
    // this is a bit of a duplication of the above but we do this for manageability of the 'truth'
    _filters = new Map()

    // We need these cause the property editor UI is not expressive enough yet
    _sfAdvancedFilter
    _tabAdvancedFilter
//#endregion Filter variables
    
    // Used in the error html page
    errorMessage;

    _viz;
    _isLibLoaded = false;
//#endregion Member Variables

    @wire(getRecord, {
        recordId: '$recordId',
        fields: '$_recordFilterFields'
    })
    getRecord({ error, data }) {
        if (data) {
            // iterate over each recordFilterField and get the value
            let err = false
            this._recordFilters.forEach( (tableauField, recordField) => {
                const fieldValue = getFieldValue(data, recordField)
                if (fieldValue === undefined) {
                    err = true
                } else {
                    this.addFilter(tableauField, fieldValue)
                }
            })
            this._recordFiltersResolved = true
            if (err) {
                this.errorMessage = `Failed to retrieve value for field ${this.sfAdvancedFilter}`
            } else {
                this.renderViz();
            }
        } else if (error) {
            this.errorMessage = `Failed to retrieve record data: ${reduceErrors(
                error
            )}`;
        }
    }

//#region Getter & Setter Helpers
    // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#boolean-attributes
    _setBooleanAttribute(name, v) {
        switch (typeof v) {
            case 'string' :
                if ((v === '') || (v === name)) {
                    this.setAttribute(name, '')
                } else {
                    this.removeAttribute(name);
                }
                break;
            case 'boolean' :
                if (v) {
                    this.setAttribute(name, '');
                } else {
                    this.removeAttribute(name);
                }
                break;
            default:
                this.removeAttribute(name);
        }
    }

    // hasAttribute is not available on the LightningElement from testing so ... workaround
    // All boolean elements are defaulted to false
    _checkBooleanAttribute(name) {
        return (null != this.getAttribute(name)) ? true : false
    }

    // Use a _default map to make it clearer on review of code what defaults are for the object
    static _defaults = {
        'viz-url': '',
        'height': 550
    }
//#endregion

//#region Simple Getters / Setters
    @api
    get vizUrl() {
        return this.getAttribute('viz-url') || TableauViz._defaults['viz-url']
    }

    set vizUrl(val) {
        this.setAttribute('viz-url', val)
    }

    @api
    get showTabs() {
        return this._checkBooleanAttribute('show-tabs')
    }

    set showTabs(val) {
        this._setBooleanAttribute('show-tabs', val)
    }

    @api
    get showToolbar() {
        return this._checkBooleanAttribute('show-toolbar')
    }

    set showToolbar(val) {
        this._setBooleanAttribute('show-toolbar', val)
    }

    @api
    get filterOnRecordId() {
        return this._checkBooleanAttribute('filter-on-record-id')
    }

    set filterOnRecordId(val) {
        this._setBooleanAttribute('filter-on-record-id', val)
    }

    @api
    get height() {
        return this.getAttribute('height') || TableauViz._defaults.height
    }

    set height(val) {
        this.setAttribute('height', val)
    }

    @api
    get tabAdvancedFilter() {
        return this._tabAdvancedFilter
    }

    set tabAdvancedFilter(val) {
        this._tabAdvancedFilter = val;
        if (this.sfAdvancedFilter) {
            this.addRecordFilter(this.sfAdvancedFilter, this._tabAdvancedFilter)
        }
    }

    @api
    get sfAdvancedFilter() {
        return this._sfAdvancedFilter
    }

    set sfAdvancedFilter(val) {
        this._sfAdvancedFilter = val
        if (this.tabAdvancedFilter) {
            this.addRecordFilter(this._sfAdvancedFilter, this.tabAdvancedFilter)
        }
    }
//#endregion

//#region Filter handling
    // Record filter is of type { recordField: <>, tableauField: <> }
    addRecordFilter(recordField, tableauField) {
        this._recordFiltersResolved = false
        this._recordFilters.set(recordField, tableauField)
        this._recordFilterFields = [...this._recordFilters.keys()]
    }

    addFilter(field, value) {
        this._filters.set(field, value)
    }

//#endregion
    async connectedCallback() {
        await loadScript(this, tableauJSAPI);
        this._isLibLoaded = true;
        this.renderViz();
    }

    renderedCallback() {
        this.renderViz();
    }

    renderViz() {
        // Halt rendering if inputs are invalid or if there's an error
        if (!this.validateInputs() || this.errorMessage) {
            return;
        }

        // Halt rendering if lib is not loaded
        if (!this._isLibLoaded) {
            return;
        }

        // Halt rendering if advanced filter value is not yet loaded
        if (!this._recordFiltersResolved) {
            return;
        }

        const containerDiv = this.template.querySelector(
            'div.tabVizPlaceholder'
        );

        // Configure viz URL
        const vizToLoad = new URL(this.vizUrl);
        this.setVizDimensions(vizToLoad, containerDiv);
        this.setVizFilters(vizToLoad);
        TableauViz.checkForMobileApp(vizToLoad, window.navigator.userAgent);
        const vizURLString = vizToLoad.toString();

        // Set viz Options
        const options = {
            hideTabs: !this.showTabs,
            hideToolbar: !this.showToolbar,
            height: `${this.height}px`,
            width: '100%'
        };

        // eslint-disable-next-line no-undef
        this._viz = new tableau.Viz(containerDiv, vizURLString, options);
    }

    render() {
        if (this.errorMessage) {
            return templateError;
        }
        return templateMain;
    }

//#region Validation methods
    _validateRecordFilterValuesSet(sfField, tabField) {
        // either both are set or neither. 
        return (sfField && tabField) || !(sfField || tabField)
    }

    validateInputs() {
        // Validate viz url
        try {
            const u = new URL(this.vizUrl)
            if (u.protocol !== 'https:') {
                throw Error(
                    'Invalid URL. Make sure the link to the Tableau view is using HTTPS.'
                );
            }

            if (u.toString().replace(u.origin, '').startsWith('/#/')) {
                throw Error(
                    "Invalid URL. Enter the link for a Tableau view. Click Copy Link to copy the URL from the Share View dialog box in Tableau. The link for the Tableau view must not include a '#' after the name of the server."
                );
            }
        } catch (error) {
            this.errorMessage = error.message ? error.message : 'Invalid URL';
            return false;
        }

        // when the new UI framework comes out, it will allow for composite properties so we won't get piecemeal. Until then, we check
        if (!this._validateRecordFilterValuesSet(this.sfAdvancedFilter, this.tabAdvancedFilter)) {
            this.errorMessage =
                'Advanced filtering requires that you select both Tableau and Salesforce fields. The fields should represent corresponding data, for example, user or account identifiers.';
            return false;
        }

        return true;
    }
//#endregion Validaton methods

    // Height is set by the user
    // Width is based on the containerDiv to which the viz is added
    // The ':size' parameter is added to the url to communicate this
    setVizDimensions(vizToLoad, containerDiv) {
        containerDiv.style.height = `${this.height}px`;
        const vizWidth = containerDiv.offsetWidth;
        vizToLoad.searchParams.append(':size', `${vizWidth},${this.height}`);
    }

    setVizFilters(vizToLoad) {
        // In context filtering
        if (this.filterOnRecordId === true && this.objectApiName) {
            const filterNameTab = `${this.objectApiName} ID`;
            vizToLoad.searchParams.append(filterNameTab, this.recordId);
        }

        this._filters.forEach( (val, field) => {
            vizToLoad.searchParams.append(field, val)
        })
    }

//#region Mobile specific methods
    static checkForMobileApp(vizToLoad, userAgent) {
        const mobileRegex = /SalesforceMobileSDK/g;
        if (!mobileRegex.test(userAgent)) {
            return;
        }

        const deviceIdRegex = /uid_([\w|-]+)/g;
        const deviceNameRegex = /(iPhone|Android|iPad)/g;

        const deviceIdMatches = deviceIdRegex.exec(userAgent);
        const deviceId =
            deviceIdMatches == null
                ? TableauViz.generateRandomDeviceId()
                : deviceIdMatches[1];
        const deviceNameMatches = deviceNameRegex.exec(userAgent);
        const deviceName =
            deviceNameMatches == null
                ? 'SFMobileApp'
                : `SFMobileApp_${deviceNameMatches[1]}`;

        vizToLoad.searchParams.append(':use_rt', 'y');
        vizToLoad.searchParams.append(':client_id', 'TableauVizLWC');
        vizToLoad.searchParams.append(':device_id', deviceId);
        vizToLoad.searchParams.append(':device_name', deviceName);
    }

    /* ***********************
     * This function just needs to generate a random id so that if the user-agent for this mobile device
     * doesn't contain a uid_ field, we can have a random id that is not likely to collide if the same user logs
     * in to SF Mobile from a different mobile device that also doesn't have a uid_ field.
     * ***********************/
    static generateRandomDeviceId() {
        function getRandomSymbol(symbol) {
            var array;

            if (symbol === 'y') {
                array = ['8', '9', 'a', 'b'];
                return array[Math.floor(Math.random() * array.length)];
            }

            array = new Uint8Array(1);
            window.crypto.getRandomValues(array);
            return (array[0] % 16).toString(16);
        }

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
            /[xy]/g,
            getRandomSymbol
        );
    }
    //#endregion Mobile specific methods
}
