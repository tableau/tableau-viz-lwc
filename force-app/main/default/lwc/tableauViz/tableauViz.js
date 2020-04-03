import { LightningElement, api, wire } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import { loadScript } from "lightning/platformResourceLoader";

import tableauJSAPI from "@salesforce/resourceUrl/tableauJSAPI";

export default class TableauViz extends LightningElement {
  privateStyle;
  @api recordId;
  @api flexipageRegionWidth;
  @api vizURL;
  @api hideTabs;
  @api hideToolbar;
  @api filter;
  @api objectApiName;

  @wire(getRecord, { recordId: "$recordId" })
  account;

  async renderedCallback() {
    await loadScript(this, tableauJSAPI);

    let containerDiv = this.template.querySelector("div");

    let vizToLoad;

    if (this.filter == true) {
      vizToLoad =
        this.vizURL + "?" + this.objectApiName + " ID=" + this.recordId;
    } else {
      vizToLoad = this.vizURL;
    }

    const options = {
      hideTabs: this.hideTabs,
      hideToolbar: this.hideToolbar
    };
    this.viz = new tableau.Viz(containerDiv, vizToLoad, options);
  }
}
