# Postman Server [![Build Status](https://travis-ci.org/auburnhacks/postman.svg?branch=master)](https://travis-ci.org/auburnhacks/postman) 

## What is Postman?
Postman server attempts to solve half the problem of sending marketing emails and followup emails in an effcient way. Postman server is an HTTP server running in the cloud that exposes a REST API that can be queried. Only admis have access to view the WebUI and query the API to send emails. If you are not an admin for AuburnHacks you are on the wrong repository.

## CI Branches
* master : [![Build Status](https://travis-ci.org/auburnhacks/postman.svg?branch=master)](https://travis-ci.org/auburnhacks/postman) 
* dev    : [![Build Status](https://travis-ci.org/auburnhacks/postman.svg?branch=dev)](https://travis-ci.org/auburnhacks/postman)

### Installing
To install postman server follow the steps below
```
git clone https://github.com/auburnhacks/postman.git

cd postman
# Install required dev/prod dependencies
npm install 
```

### Running the server
To run the server you will need a `.env` file that consists of all the secrets are needed by the application to run normally. Email staff@auburnhacks.com and place a request for credentials. After, you've aquired the credentials run the following command:
```
gulp server
```
This should start a local development server that reloads automatically when it detects a change in the `src/` directory.

#### Optionals
To clean build cache run:
```
npm run clean
```


## Contributing
To contribute to this repository please submit a pull request stating the following:
1. What does the commit do? (explain in briefly about what this commit solves)
2. Are there any new dependencies installed? (we've tried to add all dependecies to the master branch. So refrain from installing new packages to the project)
