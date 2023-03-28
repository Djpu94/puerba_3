const { Connection, Request } = require('tedious');

// Configuración de conexión
const config = {
  server: '10.7.0.13',
  authentication: {
    type: 'default',
    options: {
      userName: 'usr_prueba',
      password: 'Pf123456'
    }
  },
  options: {
    database: 'AdventureWorks2017',
    encrypt: true,
    trustServerCertificate: true,
    rowCollectionOnDone: true,
    useColumnNames: true,
    port: 64573
  }
};

// Creación de conexión
const connection = new Connection(config);

// Manejadores de eventos de conexión
connection.on('connect', (err) => {
  if (err) {
    console.error(`Error de conexión: ${err}`);
  } else {
    console.log('Conexión establecida.');
  }
});

connection.on('error', (err) => {
  console.error(`Error de conexión: ${err}`);
});

// Función para ejecutar una consulta
function executeQuery(query) {
  return new Promise((resolve, reject) => {
    const request = new Request(query, (err, rowCount) => {
      if (err) {
        reject(err);
      } else {
        resolve(rowCount);
      }
    });

    request.on('row', (columns) => {
      columns.forEach((column) => {
        console.log(column.metadata.colName, column.value);
      });
    });

    connection.execSql(request);
  });
}

function registerUser(username, password) {
  return new Promise((resolve, reject) => {
    const request = new Request(`
      INSERT INTO coredeclientes (username, clave)
      VALUES ('${username}', '${password}');
    `, (err, rowCount) => {
      if (err) {
        reject(err);
      } else {
        resolve(rowCount);
      }
    });
    connection.execSql(request);
  });
}

function getUser(username) {
  return new Promise((resolve, reject) => {
    const request = new Request(
      `SELECT username, clave FROM coredeclientes WHERE username = '${username}';`,
      function(err) {
        if (err) {
          reject(err);
        }
      });

    let result = '';
    request.on('row', function(columns) {
      let res = JSON.parse(JSON.stringify(columns));
      result= res;
    });

    request.on('requestCompleted', function() {
      const user = {
        username: result.username.value,
        password: result.clave.value
      }
      resolve(user);
    });

    connection.execSql(request);
  });
}

function listUsers() {
  return new Promise((resolve, reject) => {
    const request = new Request(
      'SELECT * FROM coredeclientes', 
      function(err) {
        if (err) {
          reject(err);
        }
      });
    
    let result = [];
    request.on('row', function(columns) {
      result.push(JSON.parse(JSON.stringify(columns)))
      console.log('Daniel 1', result);
    });

    request.on('requestCompleted', function() {
      let res = result.map((r) => {
        return {
          username:  r.username.value,
          password:  r.clave.value
        }
      })
      console.log('Daniel 1',  res);
      resolve(res);
    });

    connection.execSql(request);
  });
}

// Exportación de la conexión y la función de consulta
module.exports = {
  connection,
  executeQuery,
  registerUser,
  getUser,
  listUsers
};