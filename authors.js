// Import the 'pool' object so our helper functions can interact with the PostgreSQL database
import { pool } from "./db/index.js";

export async function getAuthors() {
  // Query the database and return all authors

  // Define the SQL query to fetch all authors from the 'authors' table
  const queryText = "SELECT * FROM authors";

  // Use the pool object to send the query to the database
  const result = await pool.query(queryText);

  // The rows property of the result object contains the retrieved records
  return result.rows;
}

export async function getAuthorById(id) {
  // Query the database and return the author with a matching id or null

  // Define the SQL query to fetch the authors with the specified id from the 'authors' table
  const queryText = "SELECT * FROM authors WHERE id = $1";

  // Use the pool object to send the query to the database
  // passing the id as a parameter to prevent SQL injection
  const result = await pool.query(queryText, [id]);

  // The rows property of the result object contains the retrieved records
  // If a book with the specified id exists, it will be the first element in the rows array
  // If no book exists with the specified id, the rows array will be empty
  return result.rows[0] || null;
}

export async function createAuthor(author) {
  // Query the database to create an author and return the newly created author
  /* INSERT INTO SQL TEMPLATE:
  INSERT INTO table_name (column1, column2, column3, ...)
  VALUES (value1, value2, value3, ...); */
  const queryText = "INSERT INTO authors (first_name, last_name) VALUES ($1, $2) RETURNING id, first_name, last_name;";
  const result = await pool.query(queryText, [author.first_name, author.last_name]);
  return result.rows[0] || null;
}

export async function updateAuthorById(id, updates) {
  // Query the database to update an author and return the newly updated author or null
  /* UPDATE SQL TEMPLATE:
  UPDATE table_name
  SET column1 = value1, column2 = value2, ...
  WHERE condition; */
  const queryText = "UPDATE authors SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING id, first_name, last_name;";
  const result = await pool.query(queryText, [updates.first_name, updates.last_name, id]);
  return result.rows[0] || null;
}

export async function deleteAuthorById(id) {
  // Query the database to delete an author and return the deleted author or null
  const queryText = "DELETE FROM authors WHERE id = $1 RETURNING *;";
  const result = await pool.query(queryText, [id]);
  return result.rows[0] || null;
}
