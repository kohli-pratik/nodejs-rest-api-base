# REST API Base using NodeJS and MongoDB

**What does it do?**

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