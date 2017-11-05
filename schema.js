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

// dummy data for testing
if (true) {
	db.projects.find({name:"test"}, function(err, docs) {
		if (docs.length === 0) {
			db.projects.insert({
				name: "test",
				lastTaskId: 1,
				tasks: [
					{
						id: 1,
						title: "Pretend to do something",
						owner: null,
						description: "Try to look busy, okay?",
						priority: "normal",
						status: "open",
						type: "research",
						dateCreated: "2017-10-01",
						dateModified: "2017-11-01",
						timeEstimate: "120",
						timeSpent: "60",
						comments: []
					}
				]
			});
		}
	});
}

db.on("error", function(error) {
	console.log("Database Error: ", error);
});

module.exports = db;