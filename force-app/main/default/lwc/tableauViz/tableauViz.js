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
    @api filterOnRecordId;
    @api height;
    @api tabAdvancedFilter;
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
        // Verify inputs and halt rendering if there's an error
        if (!this.validateInputs() || this.errorMessage) {
            return;
        }

        // Wait for lib to load
        await loadScript(this, tableauJSAPI);

        // Halt rendering if advanced filter value is not yet loaded
        if (this.sfAdvancedFilter && this.advancedFilterValue === undefined) {
            return;
        }

        const containerDiv = this.template.querySelector(
            'div.tabVizPlaceholder'
        );

        // Configure viz URL
        const vizToLoad = new URL(this.vizURL);
        this.setVizDimensions(vizToLoad, containerDiv);
        this.setVizFilters(vizToLoad);
        const vizURLString = vizToLoad.toString();

        // Set viz Options
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

    validateInputs() {
        // Validate viz url
        try {
            const vizUrl = new URL(this.vizURL);
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
        // In context filtering
        if (this.filterOnRecordId === true && this.objectApiName) {
            const filterNameTab = `${this.objectApiName} ID`;
            vizToLoad.searchParams.append(filterNameTab, this.recordId);
        }

        // Additional Filtering
        if (this.tabAdvancedFilter && this.advancedFilterValue) {
            vizToLoad.searchParams.append(
                this.tabAdvancedFilter,
                this.advancedFilterValue
            );
        }
    }
}
