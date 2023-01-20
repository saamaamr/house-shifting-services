const dbConnect = require('../config/database');

const UserModels = {

  // signup: async (firstName, lastName, email, phone, house, road, division, upazila, zila, role, pass) => {
  //   const sql = 'INSERT INTO `users`(`first_name`, `last_name`, `email`, `phone`, `house`, `road`, `division`, `upazila`, `zila`, `role`, `pass`) VALUES(?,?,?,?,?,?,?,?,?,?)';
  //   const values = [firstName, lastName, email, phone, house, road, division, upazila, zila, role, pass]
  //   const [rows] = await dbConnect.promise().execute(sql, values);
  //   return rows;
  // },
  servie: async (stitle, items, details, price, date, status) => {
    const sql = 'INSERT INTO `org_service`(`stitle`, `items`, `details`, `price`, `date`, `status`) VALUES(?,?,?,?,?,?)';
    const values = [stitle, items, details, price, date, status]
    const [rows] = await dbConnect.promise().execute(sql, values);
    return rows;
  },
  login: async (email) => {
    const sql = `SELECT * FROM users Where email="${email}" `;
    const [rows] = await dbConnect.promise().execute(sql);
    return rows;
  },

  getUser: async (email) => {
    const sql = `SELECT * FROM users  Where email="${email}"`;
    const [rows] = await dbConnect.promise().execute(sql);
    return rows;
  },

  getService: async (sId) => {
    const sql = `SELECT * FROM org_service  Where ser_id="${sId}"`;
    const [rows] = await dbConnect.promise().execute(sql);
    return rows;
  },

  getallUser: async () => {
    const sql = `SELECT * FROM users `;
    const [rows] = await dbConnect.promise().execute(sql);
    return rows;
  },

  getaService: async () => {
    const sql = `SELECT * ,DATE_FORMAT(date,'%d/%c/%Y')as fdate FROM org_service`;
    const [rows] = await dbConnect.promise().execute(sql);
    return rows;
  },

  /* ====== user Register Model ===== */
  insertRegisterM: async (firstName, lastName, gender, email, phone, propic, house, road, division, zila, upazila, pass) => {
    try {
      const insertRegis = 'INSERT INTO `users`(`first_name`, `last_name`, `gender`, `email`, `phone`, `propic`, `house`, `road`, `division`, `zila`, `upazila`, `pass`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
      const values = [firstName, lastName, gender, email, phone, propic, house, road, division, zila, upazila, pass];
      // console.log('Database OK....',values);
      return await dbConnect.promise().execute(insertRegis, values);

    } catch (err) {
      console.log('Database Error', err);
      return err;
    }
  },

  /* ====== worker Register Model ===== */
  insertWorkerRegisterM: async (firstName, lastName, gender, email, phone, propic, nid1, nid2, house, road, division, zila, upazila, pass) => {
    try {
      const insertRegis = 'INSERT INTO `worker`( `first_name`, `last_name`, `gender`, `email`, `phone`, `propic`, `nid1`, `nid2`, `house`, `road`, `division`, `zila`, `upazila`, `pass`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
      const values = [firstName, lastName, gender, email, phone, propic, nid1, nid2, house, road, division, zila, upazila, pass];
      console.log('Database OK....', values);
      return await dbConnect.promise().execute(insertRegis, values);
    } catch (err) {
      console.log('Database Error', err);
      return err;
    }
  },



  getallWorker: async () => {
    const sql = `SELECT * ,DATE_FORMAT(date,'%d/%c/%Y')as fdate FROM worker`;
    const [rows] = await dbConnect.promise().execute(sql);
    return rows;
  },

  getUserBooking  : async (mail) => {
    const sql = `SELECT * ,DATE_FORMAT(ser_date,'%d/%c/%Y')as fdate FROM servicebooking WHERE user_email= ?`;
    const value = [mail];
    const [rows] = await dbConnect.promise().execute(sql,value);
    return rows;
  },

  getallBooking: async () => {
    const sql = `SELECT * ,DATE_FORMAT(ser_date,'%d/%c/%Y')as fdate FROM servicebooking`;
    const [rows] = await dbConnect.promise().execute(sql);
    return rows;
  },
  /* ====== Catch  mail form DB ===== */
  mailCatchM: async (mail) => {
    const getMail = 'SELECT * FROM users WHERE email= ?';
    const value = [mail];
    const [row] = await dbConnect.promise().execute(getMail, value);
    return row;
  },

  workermailCatchM: async (mail) => {
    const getMail = 'SELECT * FROM worker WHERE email= ?';
    const value = [mail];
    const [row] = await dbConnect.promise().execute(getMail, value);
    return row;
  },

  updateStatus: async (userId) => {
    const sql = `UPDATE users SET status = 1 WHERE u_id  = ${userId}`
    const [row] = await dbConnect.promise().execute(sql)
    return row
  },

  workeracUpdateStatus: async (userId) => {
    const sql = `UPDATE worker SET status = 1 WHERE w_id  = ${userId}`
    const [row] = await dbConnect.promise().execute(sql)
    return row
  },

  workerHoaldUpdateStatus: async (userId) => {
    const sql = `UPDATE worker SET status = 2 WHERE w_id  = ${userId}`
    const [row] = await dbConnect.promise().execute(sql)
    return row
  },

  bookingUpdateStatus: async (userId) => {
    const sql = `UPDATE servicebooking SET status = 1 WHERE sb_id  = ${userId}`
    const [row] = await dbConnect.promise().execute(sql)
    return row
  },

  bookingHoaldUpdateStatus: async (userId) => {
    const sql = `UPDATE servicebooking SET status = 2 WHERE sb_id  = ${userId}`
    const [row] = await dbConnect.promise().execute(sql)
    return row
  },

  getAdmin: async (userid) => {
    const sql = `SELECT * FROM admin WHERE admin_uid="${userid}"`;
    const [rows] = await dbConnect.promise().execute(sql);
    return rows;
  },

  /* ====== Catch Booking service ===== */
  insertBooking: async (uId, userEmail, userPhone, currentAddress, desHouse, desRoad, desDivision, desZila, desUpazila, serId, serTitle, serPrice, serDate, paymentMathod, paymentProof) => {
    try {
      const insertData = 'INSERT INTO `servicebooking`(`u_id`, `user_email`, `user_phone`, `current_address`, `des_house`, `des_road`, `des_division`, `des_zila`, `des_upazila`, `ser_id`, `ser_title`, `ser_price`, `ser_date`, `payment_mathod`, `payment_proof`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
      const values = [uId, userEmail, userPhone, currentAddress, desHouse, desRoad, desDivision, desZila, desUpazila, serId, serTitle, serPrice, serDate, paymentMathod, paymentProof];
      console.log('Database OK....', values);
      return await dbConnect.promise().execute(insertData, values);
    } catch (err) {
      console.log('Database Error', err);
      return err;
    }
  },


};

module.exports = UserModels;
