module.exports = {
	prodDB: {
	connector: 'mongodb',
	hostname: process.env.DB_HOST || 'localhost',
	port: process.env.DB_PORT || 27017,
	database: 'prodDB',
	},
	prodFile: {
	name : 'prodFile',
	connector: 'loopback-component-storage',
	provider: 'filesystem',
    root : './server/storage'
	}
};