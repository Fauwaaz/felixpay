import mysql from "mysql2/promise"
let connection: any = null;
export const createConnection = async (connection: any) => {
  if(!connection) {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    })
  } else {
    console.log("Connection successfull");
  }
  return connection;
}