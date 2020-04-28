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
        const containerDiv = this.template.querySelector('div');

        if (containerDiv && this.vizURL) {
            //Defining the height of the div
            containerDiv.style.height = this.height + 'px';

            //Creating a URL object
            console.log(this.vizURL);
            let vizToLoad = new URL(this.vizURL);
            //Getting Width of the viez
            let vizWidth = containerDiv.offsetHeight;

            //Define size of the viz
            vizToLoad.searchParams.append('size', vizWidth + ',' + this.height);

            //In context filtering
            if (this.filter === true && this.objectApiName) {
                const filterNameTab = `${this.objectApiName} ID`;
                vizToLoad.searchParams.append(filterNameTab, this.recordId);
            }

            //Additional Filtering
            if (this.sf_value && this.filterName) {
                vizToLoad.searchParams.append(this.filterName, this.sf_value);
            }

            let vizURLString = vizToLoad.toString();
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
