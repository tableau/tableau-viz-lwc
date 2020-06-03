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

    @wire(getRecord, {
        recordId: '$recordId',
        fields: '$sfAdvancedFilter'
    })
    getRecord({ error, data }) {
        if (data) {
            const fieldName = this.getFieldName();
            if (data.fields[fieldName]) {
                this.sfValue = data.fields[fieldName].value;
            } else {
                this.errorMessage = `Failed to retrieve value for field ${fieldName}`;
            }
        } else if (error) {
            this.errorMessage = `Failed to retrieve record data. ${this.reduceErrors(
                error
            )}`;
        }
    }

    getFieldName() {
        return this.sfAdvancedFilter.substring(
            this.sfAdvancedFilter.indexOf('.') + 1
        );
    }

    reduceErrors(errors) {
        if (!Array.isArray(errors)) {
            errors = [errors];
        }

        return (
            errors
                // Remove null/undefined items
                .filter((error) => !!error)
                // Extract an error message
                .map((error) => {
                    // UI API read errors
                    if (Array.isArray(error.body)) {
                        return error.body.map((e) => e.message);
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
                .filter((message) => !!message)
        );
    }

    async renderedCallback() {
        await loadScript(this, tableauJSAPI);

        // Validate viz URL
        let vizToLoad;
        try {
            vizToLoad = new URL(this.vizURL);
        } catch (_) {
            this.errorMessage = 'Invalid Viz URL';
            return;
        }

        // Advanced filter checks
        if (this.sfAdvancedFilter) {
            // Check qualified field name
            if ((this.sfAdvancedFilter.match(/\./g) || []).length !== 1) {
                this.errorMessage = `Invalid Salesforce qualified field name: ${this.sfAdvancedFilter}`;
                return;
            }
            // Abort rendering if field value is not yet retrieved
            if (!this.sfValue) {
                return;
            }
        }

        const containerDiv = this.template.querySelector('div');

        //Defining the height of the div
        containerDiv.style.height = `${this.height}px`;

        //Getting Width of the viz
        const vizWidth = containerDiv.offsetWidth;

        //Define size of the viz
        vizToLoad.searchParams.append(':size', `${vizWidth},${this.height}`);

        //In context filtering
        if (this.filter === true && this.objectApiName) {
            const filterNameTab = `${this.objectApiName} ID`;
            vizToLoad.searchParams.append(filterNameTab, this.recordId);
        }

        //Additional Filtering
        if (this.sfValue && this.filterName) {
            vizToLoad.searchParams.append(this.filterName, this.sfValue);
        }

        const vizURLString = vizToLoad.toString();
        const options = {
            hideTabs: this.hideTabs,
            hideToolbar: this.hideToolbar,
            height: `${this.height}px`,
            width: '100%'
        };

        // eslint-disable-next-line no-undef
        this.viz = new tableau.Viz(containerDiv, vizURLString, options);
    }
}
