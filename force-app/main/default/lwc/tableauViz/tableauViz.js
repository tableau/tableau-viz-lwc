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
    @api filter_name;
    @api sf_advanced_filter;
    viz;
    sf_value;

    // Extract current picklist value for this record
    @wire(getRecord, {
        recordId: '$recordId',
        fields: '$sf_advanced_filter'
    })
    getRecord({ error, data }) {
        if (data) {
            const fieldName = this.getFieldName();
            this.sf_value = data.fields[fieldName].value;
        } else if (error) {
            this.errorMessage = `Failed to retrieve record data. ${this.reduceErrors(
                error
            )}`;
        }
    }

    getFieldName() {
        return this.sf_advanced_filter.substring(
            this.sf_advanced_filter.indexOf('.') + 1
        );
    }

    async renderedCallback() {
        await loadScript(this, tableauJSAPI);

        const containerDiv = this.template.querySelector('div');
        containerDiv.style.height = this.height + 'px';
        let filterName = `${this.objectApiName}%20ID`;
        let vizToLoad = this.vizURL;

        //In context filtering
        if (this.filter && this.objectApiName) {
            if (vizToLoad.includes('?')) {
                vizToLoad += `&${filterName}=${this.recordId}`;
            } else {
                vizToLoad += `?${filterName}=${this.recordId}`;
            }
        }
        //Additional Filtering
        if (this.sf_value && this.objectApiName) {
            if (vizToLoad.includes('?')) {
                vizToLoad += `&${this.filter_name}=${this.sf_value}`;
            } else {
                vizToLoad += `?${this.this.filter_name}=${this.sf_value}`;
            }
        }

        const options = {
            hideTabs: this.hideTabs,
            hideToolbar: this.hideToolbar,
            height: this.height,
            width: '100%'
        };
        // eslint-disable-next-line no-undef
        this.viz = new tableau.Viz(containerDiv, vizToLoad, options);
    }
}
