# E-Commerce Site Backend

## Description
Uses Node and Express to build the back end (db schema and REST API) of an e-commerce site.

## User Story
**As a** manager at an internet retail company, **I want** a back end for my e-commerce website that uses the latest technologies **so that** my company can compete with other e-commerce companies

## Usage
1. Clone the repo
2. Install dependencies with `npm -i`
3. You may need to create the database if you haven't already:
  a. Run `mysql -u root` (if you didn't set up mysql with a password) or `mysql -u root -p` (if you did)
  b. Run `source db/schema.sql;` to create the database
  c. Run `exit;` to exit the MySQL shell
4. Run `npm run seed` to seed the database
5. Run `npm start` to run the server and make the API live
6. Use your browser or an app like [Insomnia](https://insomnia.rest/) to test the REST API.

## Models and associations
- Category
  - has many Products
- Tag
  - has many Products
- Product
  - has many Tags
  - has one Category

## Endpoints
**Categories**
- Get all categories: `GET /api/categories`
- Get one category: `GET /api/categories/:id`
- Create a category: `POST /api/categories/:id`
- Update a category: `PUT /api/categories/:id`
- Delete a category: `DELETE /api/categories/:id`

**Products**
- Get all products: `GET /api/products`
- Get one product: `GET /api/products/:id`
- Create a product: `POST /api/products/:id`
- Update a product: `PUT /api/products/:id`
- Delete a product: `DELETE /api/products/:id`

**Tags**
- Get all tags: `GET /api/tags`
- Get one tag: `GET /api/tags/:id`
- Create a tag: `POST /api/tags/:id`
- Update a tag: `PUT /api/tags/:id`
- Delete a tag: `DELETE /api/tags/:id`

## Questions
If you have questions, email me at [vlane0593@gmail.com](mailto:vlane0593@gmail.com) or reach out on [GitHub](https://www.github.com/vanessalane).
