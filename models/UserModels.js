const dbConnect = require('../config/database');

const UserModels = {

  signup: async (firstName, lastName, email, phone, house, road, division, upazila, zila, role, pass) => {
    const sql = 'INSERT INTO `users`(`first_name`, `last_name`, `email`, `phone`, `house`, `road`, `division`, `upazila`, `zila`, `role`, `pass`) VALUES(?,?,?,?,?,?,?,?,?,?)';
    const values = [firstName, lastName, email, phone, house, road, division, upazila, zila, role, pass]
    const [rows] = await dbConnect.promise().execute(sql, values);
    return rows;
  },
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
  getUser: async (firstName, lastName, email, phone, house, road, division, upazila, zila, role, pass) => {
    const sql = `SELECT * FROM users`;
    const values = [firstName, lastName, email, phone, house, road, division, upazila, zila, role, pass]
    const [rows] = await dbConnect.promise().execute(sql);
    return rows;
  },
  getaService: async (stitle, items, details, price, date, status) => {
    const sql = `SELECT * FROM aservice`;
    const values = [stitle, items, details, price, date, status]
    const [rows] = await dbConnect.promise().execute(sql);
    return rows;
  },
};

module.exports = UserModels;
