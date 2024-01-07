# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application.

## Server functionality

Server support requests to 2 collections - "users" and "clothing items".
For users supportes next requests:

- GET /users — returns all users
- GET /users/:userId - returns a user by \_id
- POST /users — creates a new user

For clothing items supported next requests:

- GET /items — returns all clothing items
- POST /items — creates a new item
- DELETE /items/:itemId — deletes an item by \_id
- PUT /items/:itemId/likes — like an item
- DELETE /items/:itemId/likes — unlike an item

## Technologies and techniques

- Node.js
- Express
- MongoDB
- Mongoose
