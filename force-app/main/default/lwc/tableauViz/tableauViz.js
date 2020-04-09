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

    async renderedCallback() {
        await loadScript(this, tableauJSAPI);

        const containerDiv = this.template.querySelector('div');
        containerDiv.style.height = this.height + 'px';

        let vizToLoad = this.vizURL;
        if (this.filter && this.objectApiName) {
            vizToLoad += `?${this.objectApiName}&ID=${this.recordId}`;
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
