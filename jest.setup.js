// Mock for the Tableau JS API
class TableauVizMock {
    containerDiv;
    vizToLoad;
    options;

    constructor(containerDiv, vizToLoad, options) {
        this.containerDiv = containerDiv;
        this.vizToLoad = vizToLoad;
        this.options = options;
        // Save this mock instance so that we can inspect it in tests
        global.tableauMockInstances.push(this);
    }
}

// Set Tableau mock in global variables
global.tableau = {
    Viz: TableauVizMock
};
global.tableauMockInstances = [];
