import { LightningElement, api, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import tableauJSAPI from '@salesforce/resourceUrl/tableauJSAPI';
import { reduceErrors } from './errorUtils.js';

import templateMain from './tableauViz.html';
import templateError from './tableauVizError.html';

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
            this.sfValue = getFieldValue(data, this.sfAdvancedFilter);
            if (this.sfValue === undefined) {
                this.errorMessage = `Failed to retrieve value for field ${this.sfAdvancedFilter}`;
            }
        } else if (error) {
            this.errorMessage = `Failed to retrieve record data: ${reduceErrors(
                error
            )}`;
        }
    }

    async renderedCallback() {
        // Wait for lib to load
        await loadScript(this, tableauJSAPI);

        // Halt rendering if there's an error
        if (this.errorMessage) {
            return;
        }

        // Halt rendering if advanced filter value is not yet loaded
        if (this.sfAdvancedFilter && !this.sfValue) {
            return;
        }

        // Validate viz URL
        let vizToLoad;
        try {
            vizToLoad = new URL(this.vizURL);
        } catch (_) {
            this.errorMessage = 'Invalid Viz URL';
            return;
        }

        const containerDiv = this.template.querySelector(
            'div.tabVizPlaceholder'
        );

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
        if (this.filterName && this.sfValue) {
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

    render() {
        if (this.errorMessage) {
            return templateError;
        }
        return templateMain;
    }
}
