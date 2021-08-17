if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = {
  dev: process.env.NODE_ENV !== 'production',
  port: process.env.PORT || 3000,
  host: process.env.HOST,
  userDB: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  doctorName: process.env.USER_DOCTOR,
  doctorPass: process.env.PASSWORD_DOCTOR,
  jwt_secret: process.env.JWT_SECRET,
  doctorTable: process.env.DOCTOR_TABLE,
  consultTable: process.env.CONSULT_TABLE,
  patientTable: process.env.PATIENT_TABLE,

}