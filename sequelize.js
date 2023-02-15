const Sequelize = require('sequelize')
const sessionModel = require('./models/session')
const chatlogsModel = require('./models/chatlogs')

var sequelize_db;

if (process.env.ENV === 'dev') {
	sequelize_db = new Sequelize('sw-kata', 'postgres', 'R@hasia', {
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
const chatLogs = chatlogsModel(sequelize_db, Sequelize)

sequelize_db.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`)
    })

module.exports = {
    zp_session,
	chatLogs
}