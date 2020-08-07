const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const sqlite3 = require('sqlite3').verbose();

// let db = new sqlite3.Database('./db/todolist.db');
// db.run('CREATE TABLE IF NOT EXISTS todos(NAME,TODOID,TASK)');
// db.close();

// open the database
let db = new sqlite3.Database('./db/todolist.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the todo database.');
});

db.serialize(() => {
  db.each(`SELECT Name as name, TODOID as todoid, TASK as task
           FROM todos`, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    // console.log(row.name);
    console.log(row.todoid + "\t" + row.name  + "\t" + row.task);
  });
});

var data = [
  ['Mungade', '26', true],
  ['Nagnath', '27', true]
]
//     db.run(`INSERT INTO todos(name, todoId, task) VALUES(?, ?, ?)`, [data], function(err) {
//       if (err) {
//         return console.log(err.message);
//       }
//       // get the last insert id
//       console.log(`A row has been inserted with rowid ${this.lastID}`);
//     });
for (var i = 0; i < data.length; i++) {
  db.run("INSERT INTO todos(name,todoid,task) values(?,?,?)", data[i][0], data[i][1], data[i][2], (err, rows) => {
    if (err) {
      throw err;
    }
    console.log('Insert Success');
  })
}

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the database connection.');
});

// open the database
// let db = new sqlite3.Database('./db/todolist.db', sqlite3.OPEN_READWRITE, (err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Connected to the todo database.');
// });

// db.serialize(() => {
//   db.each(`SELECT TODOID as id,
//                   Name as name
//            FROM todos`, (err, row) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log(row.id + "\t" + row.name);
//   });
// });

// db.close((err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Close the database connection.');
// });



// db.close();
// // open the database
// let db = new sqlite3.Database('./db/todolist.db', sqlite3.OPEN_READWRITE, (err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Connected to the todo database.');
// });

// db.serialize(() => {
//   db.each(`SELECT TODOtodoId as todoId,
//                   Name as name
//            FROM todo`, (err, row) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log(row.id + "\t" + row.name);
//   });
// });

// db.close((err) => {
//   if (err) {
//     console.error(err.message);
//   }
//   console.log('Close the todo connection.');
// });

// // Create embedded table
// const db = new sqlite3.Database('./todolist.db');
// const createTable = "CREATE TABLE IF NOT EXISTS todos ('name' text NOT NULL, 'todoId' varchar PRIMARY KEY, complete_task BOOLEAN );"
// db.run(createTable, function(err) {
//   if (err) {
//     console.log(err.message);
//   }
//   console.log('Table created')
// });

// const insert_table = data => {
//   // db.run(`INSERT into todos(todoId, name, complete_task) values(${data.id}, ${data.text}, ${data.complete})`, function(err) {
//   db.run("INSERT INTO todos(todoId, name, complete_task) values(test, testtest, 0)", function(err) {
//     if (err) {
//       console.log(err.message);
//     }
//     console.log('Table inserted')
//   });
// }

// const query_table = () => {
//   db.each("SELECT rowId AS name FROM todos", function(err, row) {
//   // db.all("SELECT todoId FROM todos", function(err, rows) {
//     // if (err) {
//     //   console.log(err.message);
//     // }
//     console.log(row.name);
//     // console.log(row.todoId + ": " + row.name + ": " + row.complete_task);
//     // console.log(err)
//   });
// }

// db.close();





const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

// const io = socketIo(server);

// let interval;



// io.on("connection", (socket) => {
//   console.log("New client connected");
//   if (interval) {
//     clearInterval(interval);
//   }
//   interval = setInterval(() => getApiAndEmit(socket), 1000);
//   socket.on("add list", data => {
//     // insert one row into the todo table
//     db.run(`INSERT INTO todos(name, todoId, task) VALUES(?, ?, ?)`, [data], function(err) {
//       if (err) {
//         return console.log(err.message);
//       }
//       // get the last insert id
//       console.log(`A row has been inserted with rowid ${this.lastID}`);
//     });

//     // close the database connection

//     console.log('Add to list');
//   });
//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//     clearInterval(interval);
//   });
// });
// // db.close();
// const getApiAndEmit = socket => {
//   const response = new Date();

//   // Emitting a new message. Will be consumed by the client
//   socket.emit("FromAPI", response);
//   // query_table();
// };

// db.close();

server.listen(port, () => console.log(`Listening on port ${port}`));