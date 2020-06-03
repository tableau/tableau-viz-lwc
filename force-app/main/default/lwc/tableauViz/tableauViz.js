import { LightningElement, api, track, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import { getRecord } from 'lightning/uiRecordApi';
import tableauJSAPI from '@salesforce/resourceUrl/tableauJSAPI';

export default class TableauViz extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api vizURL;
    @api hideTabs;
    @api hideToolbar;
    @api filter;
    @api height;
    @api filterName;
    @api sfAdvancedFilter;

    @track advancedFilterValue;
    @track errorMessage;

    // Issue 30: There are timing problems with using sfAdvancedFilter
    // to trigger the wire service. Sometimes it is undefined even though
    // it has a value when renderedCallback is called. This gives us a
    // way to force the wired service to rerun from renderedCallback if
    // needed
    trigger;

    viz;

    @wire(getRecord, {
        recordId: '$recordId',
        fields: '$sfAdvancedFilter',
        optionalFields: '$trigger'
    })
    getRecord({ error, data }) {
        if (data) {
            const fieldName = this.advancedFilterFieldName;
            if (data.fields[fieldName]) {
                this.advancedFilterValue = data.fields[fieldName].value;
            } else {
                this.errorMessage = `Failed to retrieve value for field ${fieldName}`;
            }
        } else if (error) {
            this.errorMessage = `Failed to retrieve record data. ${this.reduceErrors(
                error
            )}`;
        }
    }

    get advancedFilterFieldName() {
        return this.sfAdvancedFilter.substring(
            this.sfAdvancedFilter.indexOf('.') + 1
        );
    }

    // changing the property name breaks redeployment
    // so doing this to make it easier to read.
    get filterOnRecordId() {
        return this.filter;
    }

    get tabAdvancedFilter() {
        return this.filterName;
    }

    reduceErrors(errors) {
        if (!Array.isArray(errors)) {
            errors = [errors];
        }

        return (
            errors
                // Remove null/undefined items
                .filter(error => !!error)
                // Extract an error message
                .map(error => {
                    // UI API read errors
                    if (Array.isArray(error.body)) {
                        return error.body.map(e => e.message);
                    }
                    // UI API DML, Apex and network errors
                    else if (
                        error.body &&
                        typeof error.body.message === 'string'
                    ) {
                        return error.body.message;
                    }
                    // JS errors
                    else if (typeof error.message === 'string') {
                        return error.message;
                    }
                    // Unknown error shape so try HTTP status text
                    return error.statusText;
                })
                // Flatten
                .reduce((prev, curr) => prev.concat(curr), [])
                // Remove empty strings
                .filter(message => !!message)
        );
    }

    validateInputs() {
        // eslint-disable-next-line no-unused-vars
        let vizUrl;
        try {
            vizUrl = new URL(this.vizURL);
            if (
                !(vizUrl.protocol === 'http:') &&
                !(vizUrl.protocol === 'https:')
            ) {
                throw Error();
            }
        } catch (_) {
            this.errorMessage = 'Invalid Viz URL';
            return false;
        }

        // Advanced filter checks
        if (
            (this.sfAdvancedFilter && !this.tabAdvancedFilter) ||
            (!this.sfAdvancedFilter && this.tabAdvancedFilter)
        ) {
            this.errorMessage =
                'Advanced filtering requires both Tableau and Salesforce fields.';
            return false;
        }

        if (this.sfAdvancedFilter) {
            // Check qualified field name. Make sure 'Object.Field'
            if ((this.sfAdvancedFilter.match(/\./g) || []).length !== 1) {
                this.errorMessage = `Invalid Salesforce qualified field name: ${this.sfAdvancedFilter}`;
                return false;
            }
        }
        return true;
    }

    // Make sure that if we have advanced filters on a record page that we
    // wait until the data is loaded. The tracked properties will trigger a refresh
    validateFiltersReady() {
        if (this.sfAdvancedFilter && !this.advancedFilterValue) {
            this.trigger = this.sfAdvancedFilter;
            return false;
        }
        return true;
    }

    // Height is set by the user
    // Width is based on the containerDiv to which the viz is added
    // The ':size' parameter is added to the url to communicate this
    setVizDimensions(vizToLoad, containerDiv) {
        containerDiv.style.height = `${this.height}px`;
        const vizWidth = containerDiv.offsetWidth;

        vizToLoad.searchParams.append(':size', `${vizWidth},${this.height}`);
    }

    setVizFilters(vizToLoad) {
        //In context filtering
        if (this.filterOnRecordId === true && this.objectApiName) {
            const filterNameTab = `${this.objectApiName} ID`;
            vizToLoad.searchParams.append(filterNameTab, this.recordId);
        }

        //Additional Filtering
        if (this.sfAdvancedFilter) {
            vizToLoad.searchParams.append(
                this.tabAdvancedFilter,
                this.advancedFilterValue
            );
        }
    }

    async renderedCallback() {
        await loadScript(this, tableauJSAPI);

        if (!this.validateInputs()) {
            return;
        }

        if (!this.validateFiltersReady()) {
            return;
        }

        let vizToLoad = new URL(this.vizURL);
        const containerDiv = this.template.querySelector('div');

        this.setVizDimensions(vizToLoad, containerDiv);
        this.setVizFilters(vizToLoad);

        const options = {
            hideTabs: this.hideTabs,
            hideToolbar: this.hideToolbar,
            height: `${this.height}px`,
            width: '100%'
        };

        // eslint-disable-next-line no-undef
        this.viz = new tableau.Viz(containerDiv, vizToLoad.toString(), options);
    }
}
