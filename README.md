# badgescanner

![badgescanner gif](https://i.gyazo.com/4e908897189432735395f70cc95bf80b.gif)

A Node.js web app that captures your web cam feed and looks for QR-codes that you offer to it.

* a live video feed is captured from your web-cam (with your permission)
* every 30s, snapshots of the feed are placed in a hidden canvas control
* client-side code looks for a QR code in the image
* if QR-code is a vCard or a URL, then the information is saved in an in-browser database (PouchDB) and presented in a table
* you can optionally sync this data to an Apache CouchDB or Cloudant database

Images are not retained at all and they are **not** transferred from the browser to a server for processing - all of the image processing is performed in the browser using JavaScript.

This app is an offline-first app so once loaded, it should continue to work with or without a network connection.

## Demo

https://badgescanner.mybluemix.net
