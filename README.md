# REST API Base using NodeJS and MongoDB

### What does it do?

Uses a very simple example of a products catelog to provide examples of the following
* API implementation to perform CRUD operations
    * On Update and Delete, remove the appropriate files in the directory.
* Perform file upload/download using multer
    * Handle single or multiple files
    * Set file type restrictions for uploads
    * Set file upload size limit
* Store data into the database using Mongoose
    * Object modelling to give structure to each data.
    * Set mandatory fields
    * Create links between objects in the database to create a structure.
* API implementation to manupilate and get data
    * Filter as per filter attribute name and filter condition passed in the body.
    * Sort as per the sort condition passed in the body.
* User authentication using JWT tokens
* API lockdown as per user permissions
* Request checks to prevent a user from reading, updating or deleting another user's data unless the requester has Admin level access.
* Unit testing using Jest to ensure the APIs function as expected given the input and permission level.

### Before Using

Make sure that you have the following:
* Node.js installed (https://nodejs.org/)
* Mongodb installed and running locally (https://www.mongodb.com/)

### Usage

To run the project locally, perform the following using the command line
* Navigate to the project folder
* If running for the 1st time, install dependencies using ```npm install```
* Use this command - ```npm start```
    * It will run the server on port 3000