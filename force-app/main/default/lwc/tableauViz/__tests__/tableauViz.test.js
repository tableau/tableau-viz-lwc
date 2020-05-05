import { createElement } from 'lwc';
import TableauViz from 'c/tableauViz';
import { loadScript } from 'lightning/platformResourceLoader';

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

    it('calls the right viz URL without filters', () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.height = '550';
        element.vizURL = VIZ_URL_NO_FILTERS;

        document.body.appendChild(element);

        const div = element.shadowRoot.querySelector('div');

        return flushPromises().then(() => {
            expect(global.tableauMockInstances.length).toBe(1);
            const instance = global.tableauMockInstances[0];
            expect(instance.vizToLoad).toBe(
                VIZ_DISPLAY + div.offsetWidth + '%2C550'
            );
        });
    });

    it('calls the right viz URL with filters', () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizURL = VIZ_URL;
        element.filter = true;
        element.height = '550';
        element.objectApiName = 'Account';
        element.recordId = 'mockId';
        document.body.appendChild(element);
        const div = element.shadowRoot.querySelector('div');
        return flushPromises().then(() => {
            expect(global.tableauMockInstances.length).toBe(1);
            const instance = global.tableauMockInstances[0];
            expect(instance.vizToLoad).toBe(
                VIZ_DISPLAY + div.offsetWidth + '%2C550&Account+ID=mockId'
            );
        });
    });

    it('passes the rigth options to the viz', () => {
        const element = createElement('c-tableau-viz', {
            is: TableauViz
        });
        element.vizURL = VIZ_URL;
        element.hideTabs = false;
        element.hideToolbar = true;
        element.height = 650;
        document.body.appendChild(element);

        return flushPromises().then(() => {
            expect(global.tableauMockInstances.length).toBe(1);
            const instance = global.tableauMockInstances[0];
            expect(instance.options.hideTabs).toBeFalsy();
            expect(instance.options.hideToolbar).toBeTruthy();
            expect(instance.options.height).toBe('650px');
        });
    });
});
