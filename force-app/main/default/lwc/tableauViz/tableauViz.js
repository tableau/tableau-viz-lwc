import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import tableauJSAPI from '@salesforce/resourceUrl/tableauJSAPI';

export default class TableauViz extends LightningElement {
    @api objectApiName;
    @api recordId;
    @api vizURL;
    @api hideTabs;
    @api hideToolbar;
    @api filter;
    @api height;
    viz;
    errorMessage;
    vizDisplayed;
    vizToLoad;

    get isVizDisplayed() {
        this.createErrorMessage();
        this.vizDisplayed = this.validURL(this.vizURL);
        return this.vizDisplayed;
    }

    createErrorMessage() {
        if (!this.validURL(this.vizURL)) {
            this.errorMessage = 'Invalid Viz URL';
        } else {
            this.errorMessage = 'Invalid Input';
        }
    }

    validURL(str) {
        try {
            this.vizToLoad = new URL(str);
        } catch (_) {
            return false;
        }

        return true;
    }

    async renderedCallback() {
        await loadScript(this, tableauJSAPI);
        const containerDiv = this.template.querySelector('div');

        if (this.vizDisplayed) {
            //Defining the height of the div
            containerDiv.style.height = this.height + 'px';

            //Getting Width of the viz
            const vizWidth = containerDiv.offsetHeight;

            //Define size of the viz
            this.vizToLoad.searchParams.append(
                'size',
                vizWidth + ',' + this.height
            );

            //In context filtering
            if (this.filter === true && this.objectApiName) {
                const filterNameTab = `${this.objectApiName} ID`;
                this.vizToLoad.searchParams.append(
                    filterNameTab,
                    this.recordId
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
