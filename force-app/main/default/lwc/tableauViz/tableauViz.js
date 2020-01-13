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
    @api recordId

    @api vizName
    @api hideTabs
    @api hideToolbar
    @api listenToMarksSelection
    @api listenToFilterChanged

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    account;


    vizEventFilterChanged(evt) {
        console.log("Field: " + evt.getFieldName());
        console.log("EventName: " + evt.getEventName());
    }

    async vizEventMarksSelection(evt) {
        console.log("EventName: " + evt.getEventName());
        const marks = await evt.getMarksAsync();
        console.log("Marks: " + marks.getPairs());
        console.log(this.listenToMarksSelection);
    }

    vizOnFirstInteractive() {
        console.log(this.listenToFilterChanged);
        if (this.listenToFilterChanged) {
            this.viz.addEventListener(tableau.TableauEventName.FILTER_CHANGE, this.vizEventFilterChanged.bind(this))
        }
        console.log(this.listenToMarksSelection);
        if (this.listenToMarksSelection) {
            this.viz.addEventListener(tableau.TableauEventName.MARKS_SELECTION, this.vizEventMarksSelection.bind(this))
        }
    }

    async renderedCallback() {
        await loadScript(this, tableauJSAPI)
        if (this.vizName !== "--None--") {
            let containerDiv = this.template.querySelector('div');
            // const vizToLoad = "https://10az.online.tableau.com/t/tableausalesdemo/views/2014GlobalHungerIndex/" + this.vizName
            const vizToLoad = "https://10ax.online.tableau.com/t/datadevtc19/views/MoretheftsinSeattle/oftheftperprecinct"
            // const vizToLoad = "https://us-west-2a.online.tableau.com/t/alpodev/views/StoryTestResults/HealthofStoryTests"
            const options = {
                    hideTabs: this.hideTabs,
                    hideToolbar: this.hideToolbar,
                    onFirstInteractive: this.vizOnFirstInteractive.bind(this)
                };
            this.viz = new tableau.Viz(containerDiv, vizToLoad, options);
        }
    }
}