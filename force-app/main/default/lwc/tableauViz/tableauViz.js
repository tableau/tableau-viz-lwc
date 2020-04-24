import { LightningElement, api, wire, track } from 'lwc';
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
    @track record;
    viz;
    sf_value;

    // Extract current picklist value for this record
    @wire(getRecord, {
        recordId: '$recordId',
        fields: '$sfAdvancedFilter'
    })
    getRecord({ error, data }) {
        if (data) {
            this.record = data;
            const fieldName = this.getFieldName();
            this.sf_value = data.fields[fieldName].value;
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

    async renderedCallback() {
        await loadScript(this, tableauJSAPI);

        if (!this.sfAdvancedFilter || !this.filterName) {
            this.record = 'No Filter';
        }
        const containerDiv = this.template.querySelector('div');

        if (containerDiv) {
            containerDiv.style.height = this.height + 'px';
            const filterName = `${this.objectApiName}%20ID`;
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
            if (this.sf_value && this.filterName) {
                if (vizToLoad.includes('?')) {
                    vizToLoad += `&${this.filterName}=${this.sf_value}`;
                } else {
                    vizToLoad += `?${this.filterName}=${this.sf_value}`;
                }
            }

            const options = {
                hideTabs: this.hideTabs,
                hideToolbar: this.hideToolbar,
                height: this.height + 'px',
                width: '100%'
            };

            // eslint-disable-next-line no-undef
            this.viz = new tableau.Viz(containerDiv, vizToLoad, options);
        }
    }
}
