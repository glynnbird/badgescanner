# badgescanner

![badgescanner gif](https://i.gyazo.com/4e908897189432735395f70cc95bf80b.gif)

A Node.js web app that captures your web cam feed and looks for QR-codes that you offer to it.

If it finds a vCard encoded in the QR code, it is converted to JSON and stored in PouchDB where it can be synced to a remote Apache CouchDB or Cloudant database.

This app is an offline-first app so once loaded, it should continue to work with or without a network connection.

## Demo

https://badgescanner.mybluemix.net