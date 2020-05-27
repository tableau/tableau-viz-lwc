import { LightningElement, api, wire } from 'lwc';
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
    viz;
    sfValue;
    errorMessage;
    vizDisplayed;
    vizToLoad;
    recordId;

    @wire(getRecord, {
        recordId: '$recordId',
        fields: '$sfAdvancedFilter'
    })
    getRecord({ error, data }) {
        if (this.sfAdvancedFilter) {
            const fieldName = this.getFieldName();
            if (data.fields[fieldName]) {
                this.sfValue = data.fields[fieldName].value;
            } else if (error) {
                this.errorMessage = `Failed to retrieve record data. ${this.reduceErrors(
                    error
                )}`;
            }
        }
    }

    get isVizDisplayed() {
        this.vizDisplayed = this.checkForErrors();
        return this.vizDisplayed;
    }

    checkForErrors() {
        this.createErrorMessage();
        this.vizDisplayed =
            (this.validURL(this.vizURL) && !this.sfAdvancedFilter) ||
            this.sfValue;
        return this.vizDisplayed;
    }

    createErrorMessage() {
        if (!this.validURL(this.vizURL)) {
            this.errorMessage = 'Invalid Viz URL';
        } else if (!this.sfValue) {
            this.errorMessage = 'Invalid Salesforce qualified Field Name';
        } else {
            this.errorMessage = 'Invalid Input';
        }
    }

    getFieldName() {
        return this.sfAdvancedFilter.substring(
            this.sfAdvancedFilter.indexOf('.') + 1
        );
    }

    validURL(str) {
        try {
            this.vizToLoad = new URL(str);
        } catch (_) {
            return false;
        }

        return true;
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
    async renderedCallback() {
        await loadScript(this, tableauJSAPI);
        const containerDiv = this.template.querySelector('div');

        if (this.vizDisplayed) {
            //Defining the height of the div
            containerDiv.style.height = this.height + 'px';

            //Getting Width of the viz
            const vizWidth = containerDiv.offsetWidth;

            //Define size of the viz
            this.vizToLoad.searchParams.append(
                ':size',
                `${vizWidth},${this.height}`
            );

            //In context filtering
            if (this.filter === true && this.objectApiName) {
                const filterNameTab = `${this.objectApiName} ID`;
                this.vizToLoad.searchParams.append(
                    filterNameTab,
                    this.recordId
                );
            }

            //Additional Filtering
            if (this.sfValue && this.filterName) {
                this.vizToLoad.searchParams.append(
                    this.filterName,
                    this.sfValue
                );
            }

            let vizURLString = this.vizToLoad.toString();
            const options = {
                hideTabs: this.hideTabs,
                hideToolbar: this.hideToolbar,
                height: this.height + 'px',
                width: '100%'
            };

            // eslint-disable-next-line no-undef
            this.viz = new tableau.Viz(containerDiv, vizURLString, options);
        }
    }
}
