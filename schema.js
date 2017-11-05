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
			{name:"bug"}, 
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
	db.projects.find({name:"test1"}, function(err, docs) {
		if (docs.length === 0) {
			db.projects.insert([
				{
					name: "test1",
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
							dateCreated: new Date(),
							dateModified: new Date(),
							timeEstimate: "120",
							timeSpent: "60",
							comments: []
						}
					]
				},
				{
					name: "test2",
					lastTaskId: 0,
					tasks: []
				}
			]);
		}
	});
}

db.on("error", function(error) {
	console.log("Database Error: ", error);
});

module.exports = db;