# User signup and listing app - Angular

 ### A small CRUD project in angular where one can create a user, view the list of users, edit information of a user and delete a user.

 ### While creating a user or updating a information of the user, following validations will be applied.
 
 1. Check if a user with the same username, email or phone number exists, if such user already exists a validation error will be shown on the page.
 2. For phone number, a phone number can only contain 10 digits.
 
### One can also filter through the list of users by username, or search a user by id.

### Json-server is used as a fake rest api in this project.

## To get the angular app running after you've cloned the repo ...

1. At the root of the repo, type the following command in the command line to install all the necessary dependencies.

## `$ npm install`

2. After all the dependencies are installed, use 2 command line interfaces, to run the angular app in one command line and json-server in the other.

3. In one of the two command lines type the following command to run the angular app.

## `$ npm start`

4. In the other command line type the followind command to run the json-server.

## `$ npm run server`

5. After completing steps 3 and 4 successfully, simply navigate to **http://localhost:4200** to use the angular app.