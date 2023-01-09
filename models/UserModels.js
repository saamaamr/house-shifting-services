const dbConnect = require('../config/database');

const UserModels = {

  // signup: async (firstName, lastName, email, phone, house, road, division, upazila, zila, role, pass) => {
  //   const sql = 'INSERT INTO `users`(`first_name`, `last_name`, `email`, `phone`, `house`, `road`, `division`, `upazila`, `zila`, `role`, `pass`) VALUES(?,?,?,?,?,?,?,?,?,?)';
  //   const values = [firstName, lastName, email, phone, house, road, division, upazila, zila, role, pass]
  //   const [rows] = await dbConnect.promise().execute(sql, values);
  //   return rows;
  // },
  servie: async (stitle, items, details, price, date, status) => {
    const sql = 'INSERT INTO `aservice`(`stitle`, `items`, `details`, `price`, `date`, `status`) VALUES(?,?,?,?,?,?)';
    const values = [stitle, items, details, price, date, status]
    const [rows] = await dbConnect.promise().execute(sql, values);
    return rows;
  },
  login: async (email) => {
    const sql = `SELECT * FROM users Where email="${email}" `;
    const [rows] = await dbConnect.promise().execute(sql);
    return rows;
  },

  // getUser: async () => {
  //   const sql = `SELECT * FROM users `;
  //   const [rows] = await dbConnect.promise().execute(sql);
  //   return rows;
  // },

  getaService: async () => {
    const sql = `SELECT * ,DATE_FORMAT(date,'%d/%c/%Y')as fdate FROM aservice`;
    const [rows] = await dbConnect.promise().execute(sql);
    return rows;
  },
  
  /* ====== Register Model ===== */
  insertRegisterM: async (firstName, lastName, email, phone, house, road, division, zila, upazila,  role, pass) => {
    try {
      const insertRegis = 'INSERT INTO `users`(`first_name`, `last_name`, `email`, `phone`, `house`, `road`, `division`, `zila`,  `upazila`,  `role`, `pass`) VALUES(?,?,?,?,?,?,?,?,?,?,?)';
      const values = [firstName, lastName, email, phone, house, road, division, zila, upazila,  role, pass];
      // console.log('Database OK....',values);
      return await dbConnect.promise().execute(insertRegis, values);

    } catch (err) {
      console.log('Database Error', err);
      return err;
    }
  },
  /* ====== Catch  mail form DB ===== */
  mailCatchM: async (mail) => { 
    const getMail = 'SELECT * FROM users WHERE email= ?';
    const value = [mail];
    const [row] = await dbConnect.promise().execute(getMail, value);
    return row;
  },
  updateStatus: async (userId) => {
    const sql = `UPDATE users SET status = 1 WHERE u_id  = ${userId}`
    const [row] = await dbConnect.promise().execute(sql)
    return row
  },


};

module.exports = UserModels;
