# Discovery-Module

This repo contains 2 modules.

## extract-json

This module contains a script that converts a data source in CSV format to JSON to be fed into the watson service.

## discover

This module contain a script that feeds in the json files to watson discovery and queries the uploaded files to gain insight.

### Install
```
npm install
```

### Run for 1st time

This includes parsing the files, uploading the files, and then querying the discovery service. Takes time.
```
npm start
```

### Clean Run

This includes just querying the discovery service.
```
npm run start-clean
```

All the commands will automatically run both the services in sequence.

### Note

This can be used with any account. You need to replace the 'apiKey' in the config with your own api key that is obtained after setting up discovery.