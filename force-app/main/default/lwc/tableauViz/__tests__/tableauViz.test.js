import { createElement } from 'lwc';
import TableauViz from 'c/tableauViz';
import { loadScript } from 'lightning/platformResourceLoader';
import { getRecord } from 'lightning/uiRecordApi';
import { registerLdsTestWireAdapter } from '@salesforce/sfdx-lwc-jest';

// Support for mocking wired record
const mockGetRecord = require('./data/getRecord.json');
const getRecordWireAdapter = registerLdsTestWireAdapter(getRecord);

const TABLEAU_JS_API = 'tableauJSAPI';

const VIZ_URL_NO_FILTERS = 'https://vizURL.com';
const VIZ_URL = 'https://vizurl.com';
const VIZ_DISPLAY = 'https://vizurl.com/?%3Asize=';

describe('tableau-viz', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Clear mocks so that every test run has a clean implementation
        jest.clearAllMocks();
        // Reset globals
        global.tableauMockInstances = [];
    });

    // Helper function to wait until the microtask queue is empty. This is needed for promise
    // timing when the platformResourceLoader promises.
    function flushPromises() {
        // eslint-disable-next-line no-undef
        return new Promise(resolve => setImmediate(resolve));
    }

    it('loads the Tableau JS API static resource', () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        document.body.appendChild(element);

        // Validation that the loadScript promise is called once.
        expect(loadScript.mock.calls.length).toBe(1);
        // Validation that the tableau JS API static resource is passed as parameter.
        expect(loadScript.mock.calls[0][1]).toEqual(TABLEAU_JS_API);
    });

    it('calls the right viz URL without filters', async () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.height = '550';
        element.vizURL = VIZ_URL_NO_FILTERS;

        document.body.appendChild(element);

        await flushPromises();

        const div = element.shadowRoot.querySelector('div.tabVizPlaceholder');
        expect(div).not.toBeNull();
        expect(global.tableauMockInstances.length).toBe(1);
        const instance = global.tableauMockInstances[0];
        expect(instance.vizToLoad).toBe(
            VIZ_DISPLAY + div.offsetWidth + '%2C550'
        );
    });

    it('calls the right viz URL without filters on RecordPage', async () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizURL = VIZ_URL;
        element.filter = false;
        element.height = '550';
        element.objectApiName = 'Account';
        element.recordId = 'mockId';
        document.body.appendChild(element);

        await flushPromises();

        const div = element.shadowRoot.querySelector('div.tabVizPlaceholder');
        expect(div).not.toBeNull();
        expect(global.tableauMockInstances.length).toBe(1);
        const instance = global.tableauMockInstances[0];
        expect(instance.vizToLoad).toBe(
            VIZ_DISPLAY + div.offsetWidth + '%2C550'
        );
    });

    it('calls the right viz URL with filters', async () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizURL = VIZ_URL;
        element.filter = true;
        element.height = '550';
        element.objectApiName = 'Account';
        element.recordId = 'mockId';
        document.body.appendChild(element);

        await flushPromises();

        const div = element.shadowRoot.querySelector('div.tabVizPlaceholder');
        expect(div).not.toBeNull();
        expect(global.tableauMockInstances.length).toBe(1);
        const instance = global.tableauMockInstances[0];
        expect(instance.vizToLoad).toBe(
            VIZ_DISPLAY + div.offsetWidth + '%2C550&Account+ID=mockId'
        );
    });

    it('passes the rigth options to the viz', async () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizURL = VIZ_URL;
        element.hideTabs = false;
        element.hideToolbar = true;
        element.height = 650;
        document.body.appendChild(element);

        await flushPromises();

        expect(global.tableauMockInstances.length).toBe(1);
        const instance = global.tableauMockInstances[0];
        expect(instance.options.hideTabs).toBeFalsy();
        expect(instance.options.hideToolbar).toBeTruthy();
        expect(instance.options.height).toBe('650px');
    });

    it('reports error when invalid viz URL', async () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizURL = 'invalid';
        document.body.appendChild(element);

        await flushPromises();

        const errorEl = element.shadowRoot.querySelector(
            'h3.slds-text-color_destructive'
        );
        expect(errorEl).not.toBeNull();
        expect(errorEl.textContent).toBe('Invalid Viz URL');
    });

    it('reports error when invalid javascript viz URL', async () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        // eslint-disable-next-line no-script-url
        element.vizURL = 'javascript:void(0)';
        document.body.appendChild(element);

        await flushPromises();

        const errorEl = element.shadowRoot.querySelector(
            'h3.slds-text-color_destructive'
        );
        expect(errorEl).not.toBeNull();
        expect(errorEl.textContent).toBe('Invalid Viz URL');
    });

    it('reports error when advanced filter missing SF Field', async () => {
        const INVALID_FIELD = 'invalid';
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizURL = VIZ_URL;
        element.filterName = INVALID_FIELD;
        document.body.appendChild(element);

        await flushPromises();

        const errorEl = element.shadowRoot.querySelector(
            'h3.slds-text-color_destructive'
        );
        expect(errorEl).not.toBeNull();
        expect(errorEl.textContent).toBe(
            'Advanced filtering requires both Tableau and Salesforce fields.'
        );
    });

    it('reports error when AdvancedFilter missing Tableau field', async () => {
        const INVALID_FIELD = 'invalid';
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizURL = VIZ_URL;
        element.sfAdvancedFilter = INVALID_FIELD;
        document.body.appendChild(element);

        await flushPromises();

        const errorEl = element.shadowRoot.querySelector(
            'h3.slds-text-color_destructive'
        );
        expect(errorEl).not.toBeNull();
        expect(errorEl.textContent).toBe(
            'Advanced filtering requires both Tableau and Salesforce fields.'
        );
    });

    it('reports error when advanced filter and invalid qualified field format ', async () => {
        const INVALID_FIELD = 'invalid';
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizURL = VIZ_URL;
        element.sfAdvancedFilter = INVALID_FIELD;
        element.filterName = 'Name';
        document.body.appendChild(element);

        await flushPromises();

        const errorEl = element.shadowRoot.querySelector(
            'h3.slds-text-color_destructive'
        );
        expect(errorEl).not.toBeNull();
        expect(errorEl.textContent).toBe(
            `Invalid Salesforce qualified field name: ${INVALID_FIELD}`
        );
    });

    it('reports error when advanced filter and field value is missing ', async () => {
        const MISSING_FIELD = 'MissingField';

        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizURL = VIZ_URL;
        element.objectApiName = 'Account';
        element.recordId = 'mockId';
        element.sfAdvancedFilter = `Account.${MISSING_FIELD}`;
        element.filterName = 'Name';
        document.body.appendChild(element);

        getRecordWireAdapter.emit(mockGetRecord);

        await flushPromises();

        const errorEl = element.shadowRoot.querySelector(
            'h3.slds-text-color_destructive'
        );
        expect(errorEl).not.toBeNull();
        expect(errorEl.textContent).toBe(
            `Failed to retrieve value for field ${MISSING_FIELD}`
        );
    });

    it('supports custom filter options', async () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizURL = VIZ_URL;
        element.hideTabs = false;
        element.hideToolbar = true;
        element.filter = false;
        element.height = 650;
        element.objectApiName = 'Account';
        element.recordId = 'mockId';
        element.sfAdvancedFilter = 'Account.Name';
        element.filterName = 'Name';
        document.body.appendChild(element);

        getRecordWireAdapter.emit(mockGetRecord);

        await flushPromises();

        const div = element.shadowRoot.querySelector('div.tabVizPlaceholder');
        expect(div).not.toBeNull();
        expect(global.tableauMockInstances.length).toBe(1);
        const instance = global.tableauMockInstances[0];
        expect(instance.vizToLoad).toBe(
            VIZ_DISPLAY + div.offsetWidth + '%2C650&Name=SpacelySprockets'
        );
    });
});
