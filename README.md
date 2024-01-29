# [Archived] Tableau _Viz_ LWC is being replaced by native Tableau _View_ LWC

![Static Badge](https://img.shields.io/badge/archived-red)
![Static Badge](https://img.shields.io/badge/no%20maintenance%20intended-gray)

In the spirit of innovation, we're delighted to announce a major update to the Tableau LWC. With the recent Spring '24 release, we've unveiled a native version of the [Tableau _View_ LWC](https://help.tableau.com/current/online/en-us/lwc_seamless_auth.htm) to seamlessly integrate Tableau within the Salesforce ecosystem. The native Tableau _View_ LWC will replace the open-source Tableau _Viz_ LWC.

**What's New:**

The native Tableau View LWC brings a host of exciting features and optimizations, promising a more intuitive and integrated experience. This strategic enhancement is designed to elevate your workflow and empower you to create even more powerful and impactful solutions.

**Migration to Native LWC:**

To align with this exciting evolution, we've made the strategic decision to discontinue support for the open-source LWC version. As a result, we will no longer support the Tableau _Viz_ LWC. Over the coming weeks we will address and close open Issues.

**Next Steps:**

-   We encourage you to dive into the possibilities offered by the new native [Tableau _View_ LWC](https://help.tableau.com/current/online/en-us/lwc_seamless_auth.htm).
-   Should you encounter any challenges or if the issue persists, please feel free to file a bug report. We're committed to providing you with the support you need in this transformative phase.

Thank you for being part of this exciting chapter in Tableau's journey.

## Release Notes

### Archival

January 29, 2024

-   Archival of the Tableau Viz Lighting web component
-   Please migrate to [Tableau _View_ LWC](https://help.tableau.com/current/online/en-us/lwc_seamless_auth.htm).

### Version 1.3

<details>
<summary>February 9, 2023</summary>
Updated the component to use the latest version of the Tableau JavaScript API.

**Fixed in this release**

-   [Fixed] Error "[Cannot read properties of null (reading 'width')]" When Viewing Viz Embedded in Salesforce Using Lightning Web Component. There was a conflict with the Embedding JavaScript API used in the app that required an update.
</details>

### Version 1.2

<details>
<summary>October 17, 2020</summary>

**Using the Tableau Viz Lightning web component on Lighting communities**

Salesforce Spring '21 is removing the **Allow Inline Scripts and Script Access to Any Third-party Host** Content Security Policy (CSP) setting for Lightning communities. For Winter `21, Salesforce recommends switching your community to a more secure option now.

To support the increased level of security, version 1.2 of the Tableau Viz Lightning web component adds Tableau Public and Tableau Online as trusted web sites in the managed package. If you are using the Tableau Viz Lighting web component on Lighting community pages and want to embed Tableau views from Tableau Public and Tableau Online, the version 1.2 package handles the CSP change for you. However, if you want to add views from Tableau Server, you need to add the Tableau Server URL as a CSP Trusted Site. For information about how to add Tableau Server as a trusted site, see the Salesforce Help documentation, [Create CSP Trusted Sites to Access Third-Party APIs](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/csp_trusted_sites.htm).

**Fixed in this release**

-   [Fixed] When you opened a Salesforce page for editing that contains a Tableau view from Tableau Online on the page, the tabs and the toolbar are shown even if the **Show Toolbar** and **Show Tabs** options were not selected.
</details>

### Version 1.1

<details>
<summary>September 21, 2020</summary>

-   Initial public release of the Tableau Viz Lighting web component.

</details>

## Legacy Tableau Viz LWC Documentation

<details>
<summary>Archived README</summary>

### This project is archived. Please migrate to [Tableau _View_ LWC](https://help.tableau.com/current/online/en-us/lwc_seamless_auth.htm).

### Lightning Web Component for embedding Tableau into Salesforce

[![GitHub Workflow](https://github.com/tableau/tableau-viz-lwc/workflows/CI/badge.svg?branch=master)](https://github.com/tableau/tableau-viz-lwc/actions)
![Static Badge](https://img.shields.io/badge/archived-red)
![Static Badge](https://img.shields.io/badge/no%20maintenance%20intended-gray)

This project provides a Lightning web component that you can customize, deploy, and use to embed a Tableau visualization into Salesforce. This component uses the [Tableau JavaScript API](https://help.tableau.com/current/api/js_api/en-us/JavaScriptAPI/js_api.htm) for embedding Tableau views into web pages.

<div>
    <table>
        <tr>
            <td>
                <img src="https://developer.salesforce.com/resource/images/trailhead/badges/projects/trailhead_project_embed-tableau-visualizations-in-salesforce.png" alt="Trailhead Badge" width="100"/>
            </td>
            <td>
                Learn more about the Tableau Viz Lightning web component by completing the <a href="https://trailhead.salesforce.com/en/content/learn/projects/embed-tableau-visualizations-in-salesforce">Embed Tableau Visualizations in Salesforce</a> Trailhead project.
            </td>
        </tr>
    </table>
</div>

> This sample component is designed to run on the Salesforce Lightning Platform.

## Table of contents

-   [Install the Tableau Viz Lightning web component from the Salesforce AppExchange](#install-the-tableau-viz-lightning-web-component-from-the-appexchange): This is the easiest way to install the Lightning web component for embedding Tableau views. Use this option if you want to get started using the component as quickly as possible, and you aren't a developer who is interested in the code. Use this option to install the component on Trailhead Playgrounds so you can use it when tackling Trailhead Badges.

-   [Install the component using a Scratch Org](#install-the-component-using-a-scratch-org): This is the recommended installation option if you are a developer. Use this option if you wants to explore and modify the component's code.

-   [Install the component using a Developer Edition Org or a Sandbox](#install-the-component-using-a-developer-edition-org-or-a-sandbox): Consider this option if you want the component deployed to a more permanent development and demonstration environment than a scratch org.

-   [Add the Tableau Visualization component to a Lightning page](#add-the-tableau-visualization-component-to-a-lightning-page): After you have installed the component on your org, you can add a Tableau viz to a Lightning page in Salesforce.

-   [Try Filtering](#try-filtering): If you place the component on a record page you can try filtering a visualization based on the context of the hosting record page, or you can specify the fields in Tableau and Salesforce to use for filtering.

-   [Sign up for the Tableau Developer Program](#sign-up-for-the-tableau-developer-program): Join the Developer Program and the DataDev community. Learn how to customize, integrate and extend the Tableau platform to suit the needs of your organization.

-   [Troubleshooting problems deploying the Lightning web component for Tableau](#troubleshooting-problems-deploying-the-tableau-lightning-web-component): Solve issues related to deploying the Lightning Web Component for Tableau.

---

> For a demonstration of the Tableau Lightning web component in action, see the [Tableau Viz Lightning web component video](https://youtu.be/BliG1NbNg0w).

## Install the Tableau Viz Lightning web component from the AppExchange

The easiest way to install the Lightning web component for Tableau is from the [AppExchange](https://appexchange.salesforce.com/appxListingDetail?listingId=a0N4V00000GF1cSUAT).

The Tableau Viz web component on AppExchange is a container for the Tableau Visualization component available in this GitHub repository. You can install the component in production environments, or in sandbox or Developer Edition organizations on Salesforce, or in test organizations furnished through the Environment Hub. You can learn more about the Tableau Viz Lightning web component, see [Embed Tableau views in Salesforce](https://help.tableau.com/current/pro/desktop/en-us/embed_ex_lwc.htm).

After you install the package, you can [Add the Tableau Visualization component to a Lightning page](#add-the-tableau-visualization-component-to-a-lightning-page).

---

## Install the component using a Scratch Org

1. Set up your environment. Follow the steps in the [Quick Start: Lightning Web Components](https://trailhead.salesforce.com/content/learn/projects/quick-start-lightning-web-components/) Trailhead project. The steps include:

    - Enable Dev Hub in your Trailhead Playground (_Important_)
    - Install Salesforce CLI
    - Install Visual Studio Code
    - Install the Visual Studio Code Salesforce extensions, including the Lightning Web Components extension

    **Tip:** You do not need to complete the last module and create the Hello World Lightning Web Component. We use the Trail here just to help you set up your environment.

    **Note:** You will use the Salesforce CLI to perform the following steps. Be sure you enable Dev Hub in your Trailhead Playground before you begin. Login to your Playground. Go to **Setup > Development > Dev Hub**).

1. If you haven't already done so, open a Command or Terminal window and authorize your hub org and provide it with an alias (**myhuborg** in the following command):

    ```
    sfdx force:auth:web:login -d -a myhuborg

    ```

1. Clone the **tableau-viz-lwc** repository:

    ```
    git clone https://github.com/tableau/tableau-viz-lwc

    ```

1. Navigate to the directory of the repository you just cloned.

    ```
    cd tableau-viz-lwc

    ```

1) Create a scratch org and provide it with an alias (**tableau-viz-lwc** in the command below):

    ```
    sfdx force:org:create -s -f config/project-scratch-def.json -a tableau-viz-lwc

    ```

1. Push the component to your scratch org:

    ```
    sfdx force:source:push
    ```

    Or try force:source:legacy:push via the SFDX extension in VS Code if the above doesn't work.

1. Open the scratch org:

    ```
    sfdx force:org:open

    ```

    This opens Salesforce and takes you to the scratch org.

1. Now you can [Add the Tableau Visualization component to an Lightning page](#add-the-tableau-visualization-component-to-a-lightning-page).

---

## Install the component using a Developer Edition Org or a Sandbox

Follow this set of instructions if you want to deploy the component to a more permanent development environment than a Scratch org.
This includes non source-tracked orgs such as a [free Developer Edition Org](https://developer.salesforce.com/signup) or sandboxes.

1. Authorize your org and provide it with an alias (**mydevorg** in the following command):

    ```
    sfdx force:auth:web:login -s -a mydevorg
    ```

1. Clone this repository:

    ```
    git clone https://github.com/tableau/tableau-viz-lwc

    ```

1. Navigate to the directory of the repository you just cloned.

    ```
    cd tableau-viz-lwc

    ```

1. If you are setting up a Developer Edition: go to **Setup**, under **My Domain**, [register a My Domain](https://help.salesforce.com/articleView?id=domain_name_setup.htm&type=5).

1. Run this command in a terminal to deploy the component.

    ```
    sfdx force:source:deploy -p force-app
    ```

    If see an error message that asks you to specify a username or OAuth options, use the following command and replace `username` with the login name you use for `mydevorg`.

    ```
    sfdx force:source:deploy -p force-app -u username
    ```

1. If your org isn't already open, open it now:

    ```
    sfdx force:org:open -u mydevorg
    ```

    This opens Salesforce and takes you to your Developer Edition Org.

1. Now you can [Add the Tableau Visualization component to a Lightning page](#add-the-tableau-visualization-component-to-a-lightning-page).

---

## Add the Tableau Visualization component to a Lightning page

After you have successfully deployed or pushed the `tableau-viz-lwc` component to your Salesforce org, you can use the component to add a Tableau viz to a Lightning page.

1. From the App Launcher (![App Launcher](./assets/salesforce_icon-applauncher-large.jpg 'App Launcher')), find and select **Sales** (or any other App that provides a page where you can embed the Tableau Lightning Web Component).

1. Click the Setup gear (![Setup gear](./assets/salesforce_icon-setup-large.jpg 'Setup gear')) then select **Edit Page**.

1. Drag the **Tableau Visualization** component from the Custom area of the Lightning Components list to the top of the Page Canvas.

1. Select a Tableau viz to display by providing the URL for the viz in the **The URL for the Tableau view** text box.

    To find the URL for a viz on Tableau Server or Tableau Online, click **Share** on the toolbar and select **Copy Link** from the Share View dialog box. For Tableau Public, copy the URL for the viz from the address bar in your browser.

    In Salesforce, use the options for the **Tableau Visualization** component to control the size of the viz and whether you want to show the Tableau toolbar or any tabs for the viz.

> For this first release, we support SSO only with SAML. If you want to configure Tableau to use Salesforce IdP, follow the steps described in [Configure SAML with Salesforce](https://help.tableau.com/current/online/en-us/saml_config_salesforce.htm) and [Configure SAML for Tableau Viz Lightning Web Component](https://help.tableau.com/current/online/en-us/saml_config_TOL_LWC.htm) for Tableau Online. For Tableau Server, see [Configure SAML for Tableau Viz Lightning Web Component](https://help.tableau.com/current/server/en-us/saml_config_LWC.htm) for Windows and [Configure SAML for Tableau Viz Lightning Web Component](https://help.tableau.com/current/server-linux/en-us/saml_config_LWC.htm) for Linux.

![Tableau Visualization LWC](./assets/lwc_tableau_viz_url.png 'Tableau Visualization LWC')

---

## Try filtering

The Tableau Lightning web component supports two ways of filtering the Tableau visualization. These methods of filtering only work on Lightning record pages. Filtering is not available for Home pages or App pages. For record pages, you can automatically filter the Tableau visualization based upon the page it is embedded in (_context filtering_), or you can specify fields in Tableau and in Salesforce to create more sophisticated filtering.

### Context filtering

To have the visualization filtered based upon the page it is embedded in, the Tableau viz needs to have a field that corresponds to the record page ID. For example, if you want to embed a viz for sales on a user's page that shows just the sales for that user, the Tableau viz should include a field that holds the record IDs for users.

1. In your Salesforce org, select a record page where you want to embed the viz (for example, Users or Opportunities).

1. Edit the record page and configure the component by entering the URL of the Tableau viz that contains the data you want to display. The Tableau visualization must include that a field that holds the record IDs (for example, user or account IDs).

1. Select **Filter the Tableau view based upon the current Salesforce record** and save your changes to the page.

    When the record ID of the page matches the corresponding value in a field in the Tableau viz, the component applies that filter. For example, component filters the viz to show just the sales data for the user on the user's page.

### Advanced filtering

If you want more control over filtering the Tableau visualization on a records page, you can map a field in Tableau to a specific field in Salesforce.  
The Tableau field needs to be on the viz that you are embedding. The Salesforce field must be a qualified field on the page where you are embedding the viz. When the values of these two fields match, the Tableau Lightning web component will automatically filter the Tableau viz.

To test out this filtering, you can add the **Tableau Visualization** component to a record page. For example, if you have a Tableau viz that contains data that is related to sales information, you can add that viz to your opportunity record pages.

1. In your Salesforce org, click the App Launcher (![App Launcher](./assets/salesforce_icon-applauncher-large.jpg 'App Launcher')), find and select **Sales**, then click the **Accounts** tab. Select an account, for example, **Burlington Textiles** from the All Accounts list.

1. Click the Setup gear (![Setup gear](./assets/salesforce_icon-setup-large.jpg 'Setup gear')) then select **Edit Page**.

1. Drag the **Tableau Visualization** component from the Custom area of the Lightning Components list to the top of the Page Canvas.

1. Configure the component.

    - Enter the URL of the Tableau viz that contains the sales data you want to display.

    - Provide the name of the the Tableau field to use for filtering. The Tableau field needs to be the name of a field in the viz that you are embedding. For example, the viz might contain a field for the `User ID`.

    - Provide the name of the the Salesforce field to use in filtering. You can select the qualified field names for the page from the drop-down list. For example, on the account record page, you could select `Owner ID`.

    When the values from these two fields match, the LWC will automatically filter the Tableau viz.

    ![Tableau Visualization LWC Filter Settings](./assets/lwc_filtering.png 'Tableau Visualization LWC Filter Settings')

1. Save your changes to the page.

---

## Sign up for the Tableau Developer Program

We want to hear from you!

![Flex DataDev Warrior](./assets/smallWarrior_DataDev_nohashtag.png)

Join the Developer Program and gain access to the latest news about the Tableau developer platform and tools.

1. To join the Developer Program, go to [(https://www.tableau.com/developer)](https://www.tableau.com/developer) and use your Tableau login to sign up. After you join, you can sign up and get a Tableau Online developer site [(https://www.tableau.com/developer/get-site)](https://www.tableau.com/developer/get-site). With this free developer site, you can try the single sign-on experience using Salesforce as your SAML IdP and configuring SAML on Tableau Online, or you can just use the site to embed a viz from Tableau Online.

1. Try out the Tableau Viz Lightning component and samples!

    - Check out the [Tableau Viz Lightning Web Component Samples](https://github.com/tableau/tableau-viz-lwc-samples)
    - Send us your feedback
    - Check the current [Issues](https://github.com/tableau/tableau-viz-lwc/issues) and add any new ones you find
    - Request new features (add them to [Issues](https://github.com/tableau/tableau-viz-lwc/issues))
    - Ask questions of the Development Team

Welcome to the **#DataDev** Community!

---

## Troubleshooting problems deploying the Tableau Lightning web component

-   **Tip:** Be sure to run the `sfdx` commands from within the project folder.

-   If you encounter the following error message when trying to create a scratch org:

    `ERROR running force:org:create: You do not have access to the [ScratchOrgInfo] object`

    If you have not already done so, you might need to enable Dev Hub in your org. Login to your org and go to **Setup > Development > Dev Hub**). Or search for "Dev Hub" in the Quick Find text box.

-   If you encounter the following message when trying to deploy the component:

    `ERROR running force:source:deploy: Must pass a username and/or OAuth options when creating an AuthInfo instance.`

    Use the `-u username` option. To determine the `username` for your Salesforce org, you can use the command `sfdx force:org:list` to display information about the orgs you have created or are connected to.

> For more information about fixing problems with deployment, see [Troubleshoot Salesforce DX](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_troubleshoot.htm) in the [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm).

</details>
