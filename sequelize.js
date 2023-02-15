const Sequelize = require('sequelize')
const sessionModel = require('./models/session')

var sequelize_db;

if (process.env.NODE_ENV === 'development') {
	sequelize_db = new Sequelize('zopimbot', 'postgres', 'R@hasia123', {
	  host: 'localhost',
	  dialect: 'postgres'
	});
} else {
	sequelize_db = new Sequelize(process.env.DATABASE_URL, {
		logging: false,
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false,
		    },
		    keepAlive: true,
		},      
		ssl: true
	})
}


const zp_session = sessionModel(sequelize_db, Sequelize)

sequelize_db.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`)
    })

module.exports = {
    zp_session
}