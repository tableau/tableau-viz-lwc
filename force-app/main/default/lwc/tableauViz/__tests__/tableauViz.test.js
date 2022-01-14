import { createElement } from 'lwc';
import TableauViz from 'c/tableauViz';
import { VIZ_RENDER_DELAY } from 'c/tableauViz';
import { loadScript } from 'lightning/platformResourceLoader';
import { getRecord } from 'lightning/uiRecordApi';

// Support for mocking wired record
const mockGetRecord = require('./data/getRecord.json');

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

    // Helper function to wait untile the viz is rendered
    function holdForVizRendering() {
        return new Promise((resolve) => {
            // eslint-disable-next-line @lwc/lwc/no-async-operation
            setTimeout(() => resolve(), VIZ_RENDER_DELAY + 10);
        });
    }

    it('loads the Tableau JS API static resource', () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizUrl = VIZ_URL;
        document.body.appendChild(element);

        // Validation that the loadScript promise is called once.
        expect(loadScript.mock.calls.length).toBe(1);
        // Validation that the tableau JS API static resource is passed as parameter.
        expect(loadScript.mock.calls[0][1]).toEqual(TABLEAU_JS_API);
    });

    it('passes the right options to the Tableau JS API', async () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizUrl = VIZ_URL;
        element.showTabs = true;
        element.showToolbar = false;
        element.height = 650;
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await holdForVizRendering();

        expect(global.tableauMockInstances.length).toBeGreaterThanOrEqual(1);
        const instance =
            global.tableauMockInstances[global.tableauMockInstances.length - 1];
        expect(instance.options.hideTabs).toBeFalsy();
        expect(instance.options.hideToolbar).toBeTruthy();
        expect(instance.options.height).toBe('650px');
    });

    it('calls the right viz URL without filters', async () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.height = '550';
        element.vizUrl = VIZ_URL_NO_FILTERS;
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await holdForVizRendering();

        const vizPlaceholder = element.shadowRoot.querySelector(
            'div.tabVizPlaceholder'
        );
        expect(vizPlaceholder).not.toBeNull();
        expect(global.tableauMockInstances.length).toBe(1);
        const instance = global.tableauMockInstances[0];
        expect(instance.vizToLoad).toBe(
            VIZ_DISPLAY + vizPlaceholder.offsetWidth + '%2C550'
        );
    });

    it('calls the right viz URL without filters on RecordPage', async () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizUrl = VIZ_URL;
        element.filterOnRecordId = false;
        element.height = '550';
        element.objectApiName = 'Account';
        element.recordId = 'mockId';
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await holdForVizRendering();

        const div = element.shadowRoot.querySelector('div.tabVizPlaceholder');
        expect(div).not.toBeNull();
        expect(global.tableauMockInstances.length).toBe(1);
        const instance = global.tableauMockInstances[0];
        expect(instance.vizToLoad).toBe(
            VIZ_DISPLAY + div.offsetWidth + '%2C550'
        );
    });

    it('calls the right viz URL with record id filter', async () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizUrl = VIZ_URL;
        element.filterOnRecordId = true;
        element.height = '550';
        element.objectApiName = 'Account';
        element.recordId = 'mockId';
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await holdForVizRendering();

        const vizPlaceholder = element.shadowRoot.querySelector(
            'div.tabVizPlaceholder'
        );
        expect(vizPlaceholder).not.toBeNull();
        expect(global.tableauMockInstances.length).toBe(1);
        const instance = global.tableauMockInstances[0];
        expect(instance.vizToLoad).toBe(
            `${VIZ_DISPLAY}${vizPlaceholder.offsetWidth}%2C550&Account+ID=mockId`
        );
    });

    it('calls the right viz URL with advanced filters', async () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizUrl = VIZ_URL;
        element.filterOnRecordId = false;
        element.height = 650;
        element.objectApiName = 'Account';
        element.recordId = 'mockId';
        element.sfAdvancedFilter = 'Account.Name';
        element.tabAdvancedFilter = 'Name';
        document.body.appendChild(element);

        getRecord.emit(mockGetRecord);

        // Wait for any asynchronous DOM updates
        await holdForVizRendering();

        const vizPlaceholder = element.shadowRoot.querySelector(
            'div.tabVizPlaceholder'
        );
        expect(vizPlaceholder).not.toBeNull();
        expect(global.tableauMockInstances.length).toBe(1);
        const instance = global.tableauMockInstances[0];
        expect(instance.vizToLoad).toBe(
            `${VIZ_DISPLAY}${vizPlaceholder.offsetWidth}%2C650&Name=SpacelySprockets`
        );
    });

    it('reports error when invalid viz URL failed creating URL object', async () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizUrl = 'invalid';
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await holdForVizRendering();

        const errorEl = element.shadowRoot.querySelector(
            'h3.slds-text-color_destructive'
        );
        expect(errorEl).not.toBeNull();
        expect(errorEl.textContent).toBe('Invalid URL: invalid');
        expect(global.tableauMockInstances.length).toBe(0);
    });

    it('reports error when invalid javascript viz URL', async () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        // eslint-disable-next-line no-script-url
        element.vizUrl = 'javascript:void(0)';
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await holdForVizRendering();

        const errorEl = element.shadowRoot.querySelector(
            'h3.slds-text-color_destructive'
        );
        expect(errorEl).not.toBeNull();
        expect(errorEl.textContent).toBe(
            'Invalid URL. Make sure the link to the Tableau view is using HTTPS.'
        );
        expect(global.tableauMockInstances.length).toBe(0);
    });

    it('reports error when invalid viz URL is HTTP', async () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizUrl = 'http://fakeurl.com';
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await holdForVizRendering();

        const errorEl = element.shadowRoot.querySelector(
            'h3.slds-text-color_destructive'
        );
        expect(errorEl).not.toBeNull();
        expect(errorEl.textContent).toBe(
            'Invalid URL. Make sure the link to the Tableau view is using HTTPS.'
        );
        expect(global.tableauMockInstances.length).toBe(0);
    });

    it('reports error when invalid viz URL contains # right after the hostname', async () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizUrl =
            'https://vizurl.com/#/views/WorldIndicators/Population';
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await holdForVizRendering();

        const errorEl = element.shadowRoot.querySelector(
            'h3.slds-text-color_destructive'
        );
        expect(errorEl).not.toBeNull();
        expect(errorEl.textContent).toBe(
            "Invalid URL. Enter the link for a Tableau view. Click Copy Link to copy the URL from the Share View dialog box in Tableau. The link for the Tableau view must not include a '#' after the name of the server."
        );
        expect(global.tableauMockInstances.length).toBe(0);
    });

    it('reports error when advanced filter and missing Salesforce field', async () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizUrl = VIZ_URL;
        element.tabAdvancedFilter = 'mockValue';
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await holdForVizRendering();

        const errorEl = element.shadowRoot.querySelector(
            'h3.slds-text-color_destructive'
        );
        expect(errorEl).not.toBeNull();
        expect(errorEl.textContent).toBe(
            'Advanced filtering requires that you select both Tableau and Salesforce fields. The fields should represent corresponding data, for example, user or account identifiers.'
        );
        expect(global.tableauMockInstances.length).toBe(0);
    });

    it('reports error when advanced filter and missing Tableau field', async () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizUrl = VIZ_URL;
        element.sfAdvancedFilter = 'mockValue';
        document.body.appendChild(element);

        // Wait for any asynchronous DOM updates
        await holdForVizRendering();

        const errorEl = element.shadowRoot.querySelector(
            'h3.slds-text-color_destructive'
        );
        expect(errorEl).not.toBeNull();
        expect(errorEl.textContent).toBe(
            'Advanced filtering requires that you select both Tableau and Salesforce fields. The fields should represent corresponding data, for example, user or account identifiers.'
        );
        expect(global.tableauMockInstances.length).toBe(0);
    });

    it('reports error when advanced filter and getRecord fails', async () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizUrl = VIZ_URL;
        element.sfAdvancedFilter = 'mockValue';
        element.tabAdvancedFilter = 'Name';
        document.body.appendChild(element);

        getRecord.error();

        // Wait for any asynchronous DOM updates
        await holdForVizRendering();

        const errorEl = element.shadowRoot.querySelector(
            'h3.slds-text-color_destructive'
        );
        expect(errorEl).not.toBeNull();
        expect(errorEl.textContent).toMatch(/Failed to retrieve record data/);
        expect(global.tableauMockInstances.length).toBe(0);
    });

    it('reports error when advanced filter and field value is missing', async () => {
        const MISSING_FIELD = 'Account.MissingField';

        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizUrl = VIZ_URL;
        element.objectApiName = 'Account';
        element.recordId = 'mockId';
        element.sfAdvancedFilter = MISSING_FIELD;
        element.tabAdvancedFilter = 'Name';
        document.body.appendChild(element);

        getRecord.emit(mockGetRecord);

        // Wait for any asynchronous DOM updates
        await holdForVizRendering();

        const errorEl = element.shadowRoot.querySelector(
            'h3.slds-text-color_destructive'
        );
        expect(errorEl).not.toBeNull();
        expect(errorEl.textContent).toBe(
            `Failed to retrieve value for field ${MISSING_FIELD}`
        );
        expect(global.tableauMockInstances.length).toBe(0);
    });

    describe('Test mobile detection', () => {
        it('Detects that this is mobile', () => {
            const appendFn = jest.fn();
            const vizToLoad = {
                searchParams: {
                    append: appendFn
                }
            };

            const device = 'iPhone';
            const id = '9456F6A5-A240-4653-948C-0AC79890275E';
            const userAgent = `SalesforceMobileSDK/7.1.2 iOS/13.6 (${device}) Chatter/226.030(6201285) Hybrid uid_${id}`;

            TableauViz.checkForMobileApp(vizToLoad, userAgent);
            expect(appendFn.mock.calls.length).toBe(4);
            expect(appendFn.mock.calls[0][0]).toBe(':use_rt');
            expect(appendFn.mock.calls[0][1]).toBe('y');
            expect(appendFn.mock.calls[1][0]).toBe(':client_id');
            expect(appendFn.mock.calls[1][1]).toBe('TableauVizLWC');
            expect(appendFn.mock.calls[2][0]).toBe(':device_id');
            expect(appendFn.mock.calls[2][1]).toBe(id);
            expect(appendFn.mock.calls[3][0]).toBe(':device_name');
            expect(appendFn.mock.calls[3][1]).toBe(`SFMobileApp_${device}`);
        });

        it('Detects that this is not mobile', () => {
            const appendFn = jest.fn();
            const vizToLoad = {
                searchParams: {
                    append: appendFn
                }
            };

            const userAgent = `Some random browser that doesn't use the SDK`;

            TableauViz.checkForMobileApp(vizToLoad, userAgent);
            expect(appendFn.mock.calls.length).toBe(0);
        });

        it('Detects that this is an Android', () => {
            const appendFn = jest.fn();
            const vizToLoad = {
                searchParams: {
                    append: appendFn
                }
            };

            const device = 'Android';
            const id = '9456F6A50AC79890275E';
            const userAgent = `SalesforceMobileSDK/7.1.2 (${device}) Chatter/226.030(6201285) Hybrid uid_${id}`;

            TableauViz.checkForMobileApp(vizToLoad, userAgent);
            expect(appendFn.mock.calls.length).toBe(4);
            expect(appendFn.mock.calls[0][0]).toBe(':use_rt');
            expect(appendFn.mock.calls[0][1]).toBe('y');
            expect(appendFn.mock.calls[1][0]).toBe(':client_id');
            expect(appendFn.mock.calls[1][1]).toBe('TableauVizLWC');
            expect(appendFn.mock.calls[2][0]).toBe(':device_id');
            expect(appendFn.mock.calls[2][1]).toBe(id);
            expect(appendFn.mock.calls[3][0]).toBe(':device_name');
            expect(appendFn.mock.calls[3][1]).toBe(`SFMobileApp_${device}`);
        });

        it('Generates an ID if none are in the user agent string', () => {
            const appendFn = jest.fn();
            const vizToLoad = {
                searchParams: {
                    append: appendFn
                }
            };

            const randomID = '1234';
            const randomIDGenerator = jest.fn();
            TableauViz.generateRandomDeviceId = randomIDGenerator;
            randomIDGenerator.mockReturnValueOnce(randomID);

            const device = 'Android';
            const userAgent = `SalesforceMobileSDK/7.1.2 (${device}) Chatter/226.030(6201285) Hybrid`;

            TableauViz.checkForMobileApp(vizToLoad, userAgent);
            expect(appendFn.mock.calls.length).toBe(4);
            expect(randomIDGenerator.mock.calls.length).toBe(1);
            expect(appendFn.mock.calls[0][0]).toBe(':use_rt');
            expect(appendFn.mock.calls[0][1]).toBe('y');
            expect(appendFn.mock.calls[1][0]).toBe(':client_id');
            expect(appendFn.mock.calls[1][1]).toBe('TableauVizLWC');
            expect(appendFn.mock.calls[2][0]).toBe(':device_id');
            expect(appendFn.mock.calls[2][1]).toBe(randomID);
            expect(appendFn.mock.calls[3][0]).toBe(':device_name');
            expect(appendFn.mock.calls[3][1]).toBe(`SFMobileApp_${device}`);
        });
    });

    describe('Validate normalization functions', () => {
        it('Checks Boolean normalize', () => {
            let result;
            result = TableauViz.booleanNormalize(true);
            expect(result).toBe(true);
            result = TableauViz.booleanNormalize(false);
            expect(result).toBe(false);
            result = TableauViz.booleanNormalize('false');
            expect(result).toBe(false);
            result = TableauViz.booleanNormalize('true');
            expect(result).toBe(true);
        });
    });
});
