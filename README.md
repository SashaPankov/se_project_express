# WTWR (What to Wear?): Back End

The back-end project is focused on creating a server for the WTWR application.

## Server functionality

Server support requests to 2 collections - "users" and "clothing items".
For users server supportes requests:

- GET /users/me - get the logged-in user data by \_id
- PATCH /users/me - modify logged-in the user data (name and avatar fields only)

For "clothing items" collection server supportes requests:

- GET /items — returns all clothing items
- POST /items — creates a new item
- DELETE /items/:itemId — deletes an item by \_id
- PUT /items/:itemId/likes — like an item
- DELETE /items/:itemId/likes — unlike an item

Also there are requests for logging in and registering:

- POST /signin — logging in
- POST /signup — register new user

## Technologies and techniques

- Node.js
- Express
- MongoDB
- Mongoose

## Links

- [FrontEnd Domain](https://www.wtwr7206.twilightparadox.com/)
