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
    advancedFilterValue;
    errorMessage;

    @wire(getRecord, {
        recordId: '$recordId',
        fields: '$sfAdvancedFilter'
    })
    getRecord({ error, data }) {
        if (data) {
            this.advancedFilterValue = getFieldValue(
                data,
                this.sfAdvancedFilter
            );
            if (this.advancedFilterValue === undefined) {
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
        if (this.sfAdvancedFilter && !this.advancedFilterValue) {
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

        this.setVizDimensions(vizToLoad, containerDiv);
        this.setVizFilters(vizToLoad);

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

    // changing the property name breaks redeployment
    // so doing this to make it easier to read.
    get filterOnRecordId() {
        return this.filter;
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
        // In context filtering
        if (this.filterOnRecordId === true && this.objectApiName) {
            const filterNameTab = `${this.objectApiName} ID`;
            vizToLoad.searchParams.append(filterNameTab, this.recordId);
        }

        // Additional Filtering
        if (this.filterName && this.advancedFilterValue) {
            vizToLoad.searchParams.append(
                this.filterName,
                this.advancedFilterValue
            );
        }
    }
}
