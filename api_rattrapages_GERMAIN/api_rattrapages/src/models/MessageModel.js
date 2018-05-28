const uuidv4 = require('uuid/v4');

var fields_reducers = {
	"description": (value) => value.length > 0,
	"firstName": (value) => value.length > 0,
};


var MessageModel = function(params) {
	this.id = params.id || uuidv4();
	this.description = params.description || "";
	this.firstName = params.firstName || "";	
}

MessageModel.prototype.create = function() {

	var valid = true;

	var keys = Object.keys(fields_reducers);

	for (var i = 0; i < keys.length; i++)
	{
		console.log(this[keys[i]]);
		if ( typeof this[keys[i]] != typeof undefined ) {
			if ( !fields_reducers[keys[i]](this[keys[i]]) )
			{
				valid = false;
			}
		}
		else
		{
			valid = false;
		}
	}

	if (valid) {
		return this;
	} else {
		return undefined;
	}
}


module.exports = MessageModel;