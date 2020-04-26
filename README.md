# Lightning Web Component for embedding Tableau into Salesforce

[![GitHub Workflow](https://github.com/tableau/tableau-viz-lwc/workflows/CI/badge.svg?branch=master)](https://github.com/tableau/tableau-viz-lwc/actions)

This project provides a Lightning Web Component that you can customize and use to embed Tableau into Salesforce. This component uses the Tableau JavaScript API for embedding Tableau into web pages.

> This sample application is designed to run on the Salesforce Platform.

## Table of contents

- [Install the tableau-viz-lwc app using a Scratch Org](#install-the-tableau-viz-lwc-app-using-a-scratch-org): This is the recommended installation option. Use this option if you are a developer who wants to experience the app and the code.

- [Install the tableau-viz-lwc app using a Developer Edition Org or a Trailhead Playground](#install-the-tableau-viz-lwc-app-using-a-developer-edition-org-or-a-trailhead-playground): Useful when tackling Trailhead Badges or if you want the app deployed to a more permanent environment than a Scratch org.

____

## Install the tableau-viz-lwc app using a Scratch Org

1. Set up your environment. Follow the steps in the [Quick Start: Lightning Web Components](https://trailhead.salesforce.com/content/learn/projects/quick-start-lightning-web-components/) Trailhead project. The steps include:

    - Enable Dev Hub in your Trailhead Playground (*Important*)
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

1. Create a scratch org and provide it with an alias (**lwc-recipes** in the command below):

    ```
    sfdx force:org:create -s -f config/project-scratch-def.json -a tableau-viz-lwc

    ```

1. Push the app to your scratch org:

    ```
    sfdx force:source:push
    ```

1. Open the scratch org:

    ```
    sfdx force:org:open

    ```

    This opens Salesforce and takes you to the scratch org.

1. From the App Launcher (![alt text](./assets/salesforce_icon-applauncher-large.jpg)), find and select **Sales** (or any other App that provides page where you can embed the Tableau Lightning Web Component).

1. Click Setup gear (![alt text](./assets/salesforce_icon-setup-large.jpg)) then select **Edit Page**.

1. Drag the **Tableau Visualization** component from the Custom area of the Lightning Components list to the top of the Page Canvas.

1. Select a Tableau viz to display by providing the URL for the viz in the **Enter the Viz URL** text box.

  You can also control the size of the viz and whether you want to show the Tableau toolbar or any tabs for the viz.
  
> For this first release, we support SSO only with SAML. If you want to configure Tableau to use Salesforce IdP, follow the steps described in [Configure SAML with Salesforce](https://help.tableau.com/current/online/en-us/saml_config_salesforce.htm).


___

## Install the tableau-viz-lwc app using a Developer Edition Org or a Trailhead Playground

Follow this set of instructions if you want to deploy the app to a more permanent environment than a Scratch org.
This includes non source-tracked orgs such as a [free Developer Edition Org](https://developer.salesforce.com/signup) or a [Trailhead Playground](https://trailhead.salesforce.com/).

Make sure to start from a brand-new environment to avoid conflicts with previous work you may have done.

1. Authorize your Trailhead Playground or Developer org and provide it with an alias (**mydevorg** in the following command):

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

1. Run this command in a terminal to deploy the app. Replace `username` with the login name you use for `mydevorg`.

    ```
    sfdx force:source:deploy -p force-app -u username
    ```

1. If your org isn't already open, open it now:

    ```
    sfdx force:org:open -u mydevorg
    ```

    This opens Salesforce and takes you to the scratch org.

1. From the App Launcher (![alt text](./assets/salesforce_icon-applauncher-large.jpg)), find and select **Sales** (or any other App that provides page where you can embed the Tableau Lightning Web Component).

1. Click Setup gear (![alt text](./assets/salesforce_icon-setup-large.jpg)) then select **Edit Page**.

1. Drag the **Tableau Visualization** component from the Custom area of the Lightning Components list to the top of the Page Canvas.

1. Select a Tableau viz to display by providing the URL for the viz in the **Enter the Viz URL** text box.

  You can also control the size of the viz and whether you want to show the Tableau toolbar or any tabs for the viz.
  
> For this first release, we support SSO only with SAML. If you want to configure Tableau to use Salesforce IdP, follow the steps described in [Configure SAML with Salesforce](https://help.tableau.com/current/online/en-us/saml_config_salesforce.htm).
