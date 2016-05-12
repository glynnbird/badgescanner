# badgescanner

![badgescanner gif](https://i.gyazo.com/03d1bae0f0a6559f0d8fb74253269a50.gif)

A Node.js web app that captures your web cam feed and looks for QR-codes that you offer to it.

* a live video feed is captured from your web-cam (with your permission)
* every 30s, snapshots of the feed are placed in a hidden canvas control
* client-side code looks for a QR code in the image
* if the QR-code contains a vCard or a URL, then the information is saved as JSON in an in-browser database (PouchDB) and presented in a table
* you can optionally sync this data to an Apache CouchDB or Cloudant database

Images are not retained at all and they are **not** transferred from the browser to a server for processing - all of the image processing is performed in the browser using JavaScript.

This app is an offline-first app so once loaded, it should continue to work with or without a network connection.

## Demo

https://badgescanner.mybluemix.net

Print out some [sample QR codes](sample/sample-qr-codes.pdf) to try out.


## Running on Bluemix

The fastest way to deploy this application to Bluemix is to click the **Deploy to Bluemix** button below.

[![Deploy to Bluemix](https://deployment-tracker.mybluemix.net/stats/a7fa19f2313d22c8e3ee44ca736d0566/button.svg)](https://bluemix.net/deploy?repository=https://github.com/ibm-cds-labs/badgescanner)

**Don't have a Bluemix account?** If you haven't already, you'll be prompted to sign up for a Bluemix account when you click the button.  Sign up, verify your email address, then return here and click the the **Deploy to Bluemix** button again. Your new credentials let you deploy to the platform and also to code online with Bluemix and Git. If you have questions about working in Bluemix, find answers in the [Bluemix Docs](https://www.ng.bluemix.net/docs/).
