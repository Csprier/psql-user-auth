const { Pool } = require('pg');
// const connectionString = process.env.PSQL_URI;
const pool = new Pool({
//   connectionString: connectionString
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'dev1337',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_DATABASE || 'psql_backend_boilerplate_db',
});

const db = pool;

async function createDatabase() {
    try {
        await db.query(`
            CREATE DATABASE psql_backend_boilerplate_db IF NOT EXIST;
        `);
    } catch(error) {
        console.error(error);
    }
}

// ========================================================================
async function createGreetingTable() {
    try {
        await db.query(`
        CREATE TABLE IF NOT EXISTS greeting (
            greeting_id serial PRIMARY KEY,
            greeting VARCHAR(255) NOT NULL
        );`);
    } catch(error) {
        console.error(error);
    }
};

// ========================================================================
async function seedGreeting() {
    try {
        // Insert initial data into the "users" table
        await db.query(`
        INSERT INTO greeting (greeting)
        VALUES
            ('Welcome to the database. Your GET request seems to be working as intended.'),
        `);

        console.log('Greeting seeded.');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

// ========================================================================
async function createUsersTable() {
    try {
        await db.query(`
            CREATE TABLE users(
                user_id serial PRIMARY KEY,
                username VARCHAR (50) UNIQUE NOT NULL,
                password VARCHAR (355) NOT NULL,
                email VARCHAR (355) UNIQUE NOT NULL,
                authToken VARCHAR (500) NOT NULL,
                created_on TIMESTAMP NOT NULL DEFAULT now(),
                last_login TIMESTAMP
        );`);

        console.log('Users table created (if not exists).');
    } catch (error) {
        console.error('Error creating users table:', error);
    }
};


// ========================================================================
async function seedUsers() {
    try {
        // Insert initial data into the "users" table
        await db.query(`
        INSERT INTO users (username, email, password)
        VALUES
            ('user1', 'user1@example.com', 'password1'),
            ('user2', 'user2@example.com', 'password2')
        `);

        console.log('Database seeded with initial data.');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};


module.exports = async function initdb() {
    db.connect()
        .then(() => createDatabase())
        .then(() => db.query('DROP TABLE IF EXISTS greeting'))
        .then(() => db.query('DROP TABLE IF EXISTS users;')) // This is to temporarily prevent duplications of the same 2 users that get seeded
        .then(() => {
            console.log('Connected to the database. Creating tables.');
            createGreetingTable();
            createUsersTable();
            return;
        })
        .then(() => {
            console.log('Table creation successful. Seeding the database.');
            seedGreeting();
            seedUsers();
            console.log('Seeding complete.');
            return;
        })
        .finally(() => {
            // Close the database connection when done
            db.end();
            console.log('Database Initialization complete.');
            console.log('-- Ending Server Connection --')
        })
        .catch((error) => {
            console.error('Error connecting to the database:', error);
        });
};