// import mysql from 'mysql';
// // needs the gcloud proxy running to connect to the database. copy paste the command below assuming the cloudproxy exe is in your cwd. Refer to the discord message if gcloud shell is not setup.
// // ./cloudproxy.exe seg-group-sql:asia-southeast1:sqlmaster
// const connection = mysql.createConnection({

//   host: '127.0.0.1',
//   port: '3306',
//   user: 'root',
//   password: 'E(yYM{PT%pvkm~.i',
//   database: 'AppDB'
// });

// connection.connect((err) => {
//   if (err) {
//     console.error('Error connecting to MySQL, please check that your connection to the gcloud database is established. Error: ', err);
//     return;
//   }
//   console.log('[SQL]Connected to MySQL server on', connection.config.host, 'signed in as', connection.config.user);
//   connection.query("SELECT * FROM users",(_, results)=>{if(results.ok){console.log('[SQL] Self check performed, ready to accept queries');}});
// });


// export { connection };