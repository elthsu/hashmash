var mongojs = require("mongojs");

// configuration
var db = mongojs(
	"trilogira", 
	["projects", "users", "types", "statuses", "priorities"]
);

// check for existing data
db.types.find({}, function(err, docs) {
	// populate pre-defined fields
	if (docs.length === 0) {
		db.types.insert([
			{name:"feature"}, 
			{name:"research"}
		]);

		db.statuses.insert([
			{name:"to do"}, 
			{name:"in progress"}, 
			{name:"blocked"}, 
			{name:"in review"}, 
			{name: "done"}
		]);

		db.priorities.insert([
			{name:"critical"}, 
			{name:"normal"}, 
			{name:"backburner"}
		]);
	}
});

db.on("error", function(error) {
	console.log("Database Error: ", error);
});

module.exports = db;