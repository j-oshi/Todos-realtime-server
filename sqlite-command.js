const sqlite3 = require('sqlite3').verbose();
let data = [];

// Create database and table
function database_create() {
    let db = new sqlite3.Database('./db/todolist.db');
    db.run('CREATE TABLE IF NOT EXISTS todos(NAME,TODOID,TASK)');
    console.log('Database and table created.');
    db.close();
}

// Query database
function database_query() {
    return new Promise((resolve, reject) => {
        let db = new sqlite3.Database('./db/todolist.db');
        db.all('SELECT name as name, todoId as id, task as task FROM todos', [], (err, rows) => {
            if (err) {
                return console.error(err.message);
            }
            rows.forEach(row => {
                console.log(row);
                data.push(row);
            });
            resolve(data);
        })
    })
}

// Query call back
async function asyncCallQuery() {
    console.log('calling');
    const result = await database_query();
    return result;
}

// Insert into database
function database_insert(id, name, complete) {
    let db = new sqlite3.Database('./db/todolist.db');

    // insert one row into the langs table
    db.run(`INSERT INTO todos(NAME,TODOID,TASK) VALUES(?, ?, ?)`, [name, id, complete], function (err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been inserted with rowid ${this.lastID}`);
    });

    db.close();
}

// Update row in database
function database_update(id, name, complete) {
    let db = new sqlite3.Database('./db/todolist.db');

    // insert one row into the langs table
    db.run(`UPDATE todos
            SET NAME = $name, TODOID = $todoid, TASK = $task 
            WHERE TODOID = $todoid`, { $name: name, $todoid: id, $task: complete }, function (err) {
        if (err) {
            return console.log(err.message);
        }
        // get the last insert id
        console.log(`A row has been updated with rowid ${this.changes}`);
    });

    db.close();
}

// Remove row
function database_delete(id) {
    const sqlite3 = require('sqlite3').verbose();

    // open a database connection
    let db = new sqlite3.Database('./db/todolist.db', (err) => {
        if (err) {
            console.error(err.message);
        }
    });

    // delete a row based on id
    db.run(`DELETE FROM todos WHERE TODOID=?`, id, function (err) {
        if (err) {
            return console.error(err.message);
        }
        console.log(`Row(s) deleted ${this.changes}`);
    });

    // close the database connection
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
    });
}

module.exports = {
    database_create,
    asyncCallQuery,
    database_insert,
    database_update,
    database_delete
}