require('dotenv/config');
 
module.exports = {
  dialect: process.env.HK_DIALECT,
  host: process.env.HK_HOST,
  username: process.env.HK_USER,
  password: process.env.HK_PASS,
  database: process.env.HK_NAME,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
}
