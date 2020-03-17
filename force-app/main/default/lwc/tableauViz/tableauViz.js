import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { loadScript } from 'lightning/platformResourceLoader';

import tableauJSAPI from '@salesforce/resourceUrl/tableauJSAPI';

const FIELDS = [
    'Contact.Name',
    'Contact.Title',
    'Contact.Phone',
    'Contact.Email',
];

export default class TableauViz extends LightningElement {
    privateStyle;
    @api recordId
    @api flexipageRegionWidth
    @api vizURL
    @api hideTabs
    @api hideToolbar
    @api listenToMarksSelection
    @api listenToFilterChanged
    @api filter
    @api objectApiName;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    account;


    async renderedCallback() {
        await loadScript(this, tableauJSAPI);
        
        
        if (this.vizURL !== "--None--") {
            console.log(this.flexipageRegionWidth);
            console.log(this.objectApiName);
            
            let containerDiv = this.template.querySelector('div');
            console.log(this.filter);
            let vizToLoad;
            
            if(this.filter == true){
                vizToLoad = this.vizURL+"?"+this.objectApiName+" ID="+this.recordId;
            }
            else{
                vizToLoad = this.vizURL;
            }
            
            const options = {
                    hideTabs: this.hideTabs,
                    hideToolbar: this.hideToolbar                   
                };
            this.viz = new tableau.Viz(containerDiv, vizToLoad, options);
        }
    }
}