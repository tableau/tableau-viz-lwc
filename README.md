# Lightning Web Component for embedding Tableau into Salesforce - Developer Preview

[![GitHub Workflow](https://github.com/tableau/tableau-viz-lwc/workflows/CI/badge.svg?branch=master)](https://github.com/tableau/tableau-viz-lwc/actions)

This project provides a Lightning Web Component that you can customize and use to embed Tableau into Salesforce. This component uses the [Tableau JavaScript API](https://help.tableau.com/current/api/js_api/en-us/JavaScriptAPI/js_api.htm) for embedding Tableau into web pages.

> This sample component is designed to run on the Salesforce Platform.

## Table of contents

-   [Install the Beta Managed Package](#install-the-beta-managed-package): This is the easiest way to install the Lightning Web Component for Tableau. Use this option if you want to get started using the component as quickly as possible, and you aren't a developer who is interested in the code and customization. Use this option to install the component on Trailhead Playgrounds so you can use it when tackling Trailhead Badges.

-   [Install the component using a Scratch Org](#install-the-component-using-a-scratch-org): This is the recommended installation option if you are a developer. Use this option if you are a developer who wants to experience the component and the code.

-   [Install the component using a Developer Edition Org](#install-the-component-using-a-developer-edition-org): Useful if you want the component deployed to a more permanent environment than a Scratch org.

-   [Add the Tableau Visualization component to a Lightning Web page](#add-the-tableau-visualization-component-to-a-lightning-web-page): After you have installed the component on your org, you can add a Tableau viz to an App in Salesforce.

-   [Try Filtering](#try-filtering): If you place the component on a record page you can try filtering a visualization based on the context of the hosting record page, or you can specify the fields in Tableau and Salesforce to use for filtering.

-   [Sign up for the LWC test scenarios on the Tableau Developer Program Portal](#sign-up-for-the-LWC-test-scenarios-on-the-tableau-developer-program-portal): Join the Developer Program and gain access to the private Tableau LWC test scenarios.

-   [Troubleshooting problems deploying the LWC for Tableau](#troubleshooting-problems-deploying-the-lwc-for-Tableau): Solve issues related to deploying the Lightning Web Component for Tableau.

---

## Install the beta managed package

The package (Tableau Viz LWC) is a container for the Tableau Visualization component available in this GitHub repository. You can install the beta package in sandbox or Developer Edition organizations on Salesforce, or in test organizations furnished through the Environment Hub. You can learn more about [Beta Versions of Managed Package](https://developer.salesforce.com/docs/atlas.en-us.packagingGuide.meta/packagingGuide/packaging_about_beta_packages.htm) on the Salesforce website.

1. Click one of the following links to install the beta package;
   | For | Use |
   |------------|------------------|
   | Dev orgs: | [Tableau Viz LWC](https://tabsoft.co/LWCbetapackage)|
   | Scratch orgs and sandboxes: | [Tableau Viz LWC Sandbox](https://tabsoft.co/LWCSandboxbetapackage) |

1. This package requires a password, use the following:

    `datadev20`

1. After you install the package, you can [Add the Tableau Visualization component to a Lightning Web page](#add-the-tableau-visualization-component-to-a-lightning-web-page).

> **Note:** The Tableau Viz LWC package is a beta package and can't be used in production environments until it is officially released.

---

## Install the component using a Scratch Org

1. Set up your environment. Follow the steps in the [Quick Start: Lightning Web Components](https://trailhead.salesforce.com/content/learn/projects/quick-start-lightning-web-components/) Trailhead project. The steps include:

    - Enable Dev Hub in your Trailhead Playground (_Important_)
    - Install Salesforce CLI
    - Install Visual Studio Code
    - Install the Visual Studio Code Salesforce extensions, including the Lightning Web Components extension

---

> Note that you will use the Salesforce CLI to perform the following steps. Be sure you enable Dev Hub in your Trailhead Playground before you begin. Login to your Playground. Go to **Setup > Development > Dev Hub**).

---

1. If you haven't already done so, open a Command window and authorize your hub org and provide it with an alias (**myhuborg** in the following command):

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

1. Create a scratch org and provide it with an alias (**tableau-viz-lwc** in the command below):

    ```
    sfdx force:org:create -s -f config/project-scratch-def.json -a tableau-viz-lwc

    ```

1. Push the component to your scratch org:

    ```
    sfdx force:source:push
    ```

1. Open the scratch org:

    ```
    sfdx force:org:open

    ```

    This opens Salesforce and takes you to the scratch org.

1. Now you can [Add the Tableau Visualization component to an Lightning Web page](#add-the-tableau-visualization-component-to-a-lightning-web-page).

---

## Install the component using a Developer Edition Org

Follow this set of instructions if you want to deploy the component to a more permanent environment than a Scratch org.
This includes non source-tracked orgs such as a [free Developer Edition Org](https://developer.salesforce.com/signup).

1. Authorize your Developer org and provide it with an alias (**mydevorg** in the following command):

    ```
    sfdx force:auth:web:login -d -a mydevorg
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

1. Now you can [Add the Tableau Visualization component to a Lightning Web page](#add-the-tableau-visualization-component-to-a-lightning-web-page).

---

## Add the Tableau Visualization component to a Lightning Web page

After you have successfully deployed or pushed the `tableau-viz-lwc` component to your Salesforce org, you can use the component to add a Tableau viz to a Lightning Web page.

1. From the App Launcher (![App Launcher](./assets/salesforce_icon-applauncher-large.jpg 'App Launcher')), find and select **Sales** (or any other App that provides page where you can embed the Tableau Lightning Web Component).

1. Click the Setup gear (![Setup gear](./assets/salesforce_icon-setup-large.jpg 'Setup gear')) then select **Edit Page**.

1. Drag the **Tableau Visualization** component from the Custom area of the Lightning Components list to the top of the Page Canvas.

1. Select a Tableau viz to display by providing the URL for the viz in the **Enter the Viz URL** text box.

    To find the URL for a viz on Tableau Server or Tableau Online, click **Share** on the toolbar and select **Copy Link** from the Share View dialog box. For Tableau Public, copy the URL for the viz from the address bar in your browser.

    In Salesforce, use the options for the **Tableau Visualization** component to control the size of the viz and whether you want to show the Tableau toolbar or any tabs for the viz.

> For this first release, we support SSO only with SAML. If you want to configure Tableau to use Salesforce IdP, follow the steps described in [Configure SAML with Salesforce](https://help.tableau.com/current/online/en-us/saml_config_salesforce.htm).

![Tableau Visualization LWC](./assets/lwc_tableau_viz_url.png 'Tableau Visualization LWC')

---

## Try filtering

The beta release of the Tableau LWC supports two ways of filtering the Tableau visualization. These methods of filtering only work on Lightning record pages. Filtering is not available for Home or Apps. For record pages, you can automatically filter the Tableau visualization based upon the page it is embedded in (_context filtering_), or you can specify fields in Tableau and in Salesforce to create more sophisticated filtering.

### Context filtering

To have the visualization filtered based upon the page it is embedded in, the Tableau viz needs to have a field that corresponds to the record page ID. For example, if you want to embed a viz for sales on a user's page that shows just the sales for that user, the Tableau viz should include a field that holds the record IDs for users.

1. In your Salesforce org, select a record page where you want to embed the viz (for example, Users or Opportunities).

1. Edit the record page and configure the component by entering the URL of the Tableau viz that contains the data you want to display. The Tableau visualization must include that a field that holds the record IDs (for example, user or account IDs).

1. Select **Filter visualization based on the page** and save your changes to the page.

    When the record ID of the page matches the corresponding value in a field in the Tableau viz, the LWC applies that filter. For example, LWC filters the viz to show just the sales data for the user on the user's page.

### Advanced filtering

If you want more control over filtering the Tableau visualization on a records page, you can map a field in Tableau to a specific field in Salesforce.  
The Tableau field needs to be on the viz that you are embedding. The Salesforce field must be a qualified field on the page where you are embedding the viz. When the values of these two fields match, the LWC will automatically filter the Tableau viz

To test out this filtering, you can add the **Tableau Visualization** component to a record page. For example, if you have a Tableau viz that contains data that is related to sales information, you can add that viz to your opportunity record pages.

1. In your Salesforce org, click the App Launcher (![App Launcher](./assets/salesforce_icon-applauncher-large.jpg 'App Launcher')), find and select **Sales**, then click the **Opportunities** tab. Select an opportunity, for example, **Burlington Textiles** from the All Opportunities list.

1. Click the Setup gear (![Setup gear](./assets/salesforce_icon-setup-large.jpg 'Setup gear')) then select **Edit Page**.

1. Drag the **Tableau Visualization** component from the Custom area of the Lightning Components list to the top of the Page Canvas.

1. Configure the component.

    - Enter the URL of the Tableau viz that contains the sales data you want to display.


    - Provide the name of the the Tableau field to use for filtering. The Tableau field needs to be the name of a field in the viz that you are embedding. For example, the viz might contain a field for the account ID.

    - Provide the name of the the Salesforce field to use in filtering. The Salesforce field needs to specify a qualified field name for that page. For example, on the opportunity record page, you could use `Opportunity.AccountId`.

    When the values from these two fields match, the LWC will automatically filter the Tableau viz.

    ![Tableau Visualization LWC Filter Settings](./assets/lwc_filtering.png 'Tableau Visualization LWC Filter Settings')

1. Save your changes to the page.

---

## Sign up for the LWC test scenarios on the Tableau Developer Program Portal

We want to hear from you!

![Flex DataDev Warrior](./assets/smallWarrior_DataDev_nohashtag.png)

Join the Developer Program and gain access to the Tableau LWC test scenarios on the Developer Program Portal.

1. To join the Developer Program, go to [(https://www.tableau.com/developer)](https://www.tableau.com/developer) and use your Tableau login to sign up. After you join, you can sign up and get a Tableau Online developer site [(https://www.tableau.com/developer/get-site)](https://www.tableau.com/developer/get-site). With this free developer site, you can try the single sign-on experience using Salesforce as your SAML IdP and configuring SAML on Tableau Online, or you can just use the site to embed a viz from Tableau Online.

1. To get to the LWC scenarios, go to the Tableau Pre-Release site (https://prerelease.tableau.com/) and follow the links to the Developer Program Portal. The portal will appear under **My Projects**.

    If you don't already have access to Developer Program Portal, send email to [tableaulwcprerelease@tableau.com](mailto:tableaulwcprerelease@tableau.com?subject=Tableau%20LWC%20Pre-Release) with **Tableau LWC Pre-Release** on the subject line.

1. On the Developer Program Portal, choose the **Tableau Lightning Web Component Alpha**, which appears under **Tasks** in the left-hand navigation pane.

1. Complete the Tableau LWC test scenarios.

    - Send us your feedback
    - Report any bugs you find
    - Request new features
    - Ask questions of the Development Team

Welcome to the **#DataDev** Community!

![Tableau LWC test scenarios](assets/lwc_alpha.gif)

---

## Troubleshooting problems deploying the LWC for Tableau

-   **Tip:** Be sure to run the `sfdx` commands from within the project folder.

-   If you encounter the following error message when trying to create a scratch org:

    `ERROR running force:org:create: You do not have access to the [ScratchOrgInfo] object`

    If you have not already done so, you might need to enable Dev Hub in your org. Login to your org and go to **Setup > Development > Dev Hub**). Or search for "Dev Hub" in the Quick Find text box.

-   If you encounter the following message when trying to deploy the component:

    `ERROR running force:source:deploy: Must pass a username and/or OAuth options when creating an AuthInfo instance.`

    Use the `-u username` option. To determine the `username` for your Salesforce org, you can use the command `sfdx force:org:list` to display information about the orgs you have created or are connected to.

> For more information about fixing problems with deployment, see [Troubleshoot Salesforce DX](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_troubleshoot.htm) in the [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm).
