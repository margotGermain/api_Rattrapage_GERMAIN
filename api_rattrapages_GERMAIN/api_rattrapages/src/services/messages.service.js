"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "messages",

	settings: {
 		state: {

 		}
	},

	actions: {

		//call "messages.create" --description "Mon message test" --firstName "margoooot"
		create: {
			params: {
				description: "string",
				firstName: "string",
			},
			handler(ctx) {
				var message = new Models.Message(ctx.params).create();
				console.log("your message is create ", message);
				if (message) {
					console.log("je suis dans la boucle");
					return Database()
						.then((db) => {
							var allMessages = db.get("messages");

							if(allMessages.find({ "description": message.description }).value()) {
								throw new MoleculerError("messages", 409, "ERR_CRITICAL", { code: 409, message: "Your message already exists."} )
							}
							return allMessages
								.push(message)
								.write()
								.then(() => {
									return message;
								})
								.catch(() => {
									throw new MoleculerError("messages", 500, "ERR_CRITICAL", { code: 500, message: "Critical error." } )
								});
					});
				} else {
					throw new MoleculerError("messages", 417, "ERR_CRITICAL", { code: 417, message: "Message is not valid." } )
				}
			}
		},

		//call "messages.getAll"
		getAll: {
			params: {

			},
			handler(ctx) {
				return Database()
					.then((db) => {
						return db.get("messages").value();
					});
			}
		},


		//call "messages.get" --idMessage "e8b0e51b-7f3c-4d8c-8bc9-7d274c2c30fc"
		
		get: {
			params: {
				idMessage: "string"
			},
			handler(ctx) {
				return ctx.call("messages.verify", { idMessage: ctx.params.idMessage })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var message = db.get("messages").find({ id: ctx.params.idMessage }).value();
								return message;
							})
							.catch(() => {
								throw new MoleculerError("messages", 500, "ERR_CRITICAL", { code: 500, message: "Critical error." } )
							});
					} else {
						throw new MoleculerError("messages", 404, "ERR_CRITICAL", { code: 404, message: "Message doesn't exist." } )
					}
				})
			}
		},

		//call "messages.verify" --idMessage "e8b0e51b-7f3c-4d8c-8bc9-7d274c2c30fc"
		verify: {
			params: {
				idMessage: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("messages")
										.filter({ id: ctx.params.idMessage })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//call "messages.edit" --idMessage "e8b0e51b-7f3c-4d8c-8bc9-7d274c2c30fc" --description "j ai edit mon message" --firstName "margoootttee"
		edit: {
			params: {
				idMessage: "string",
				description: "string",
				firstName: "string",				
			},
			handler(ctx) {
				return ctx.call("messages.get", { idMessage: ctx.params.idMessage })
						.then((db_message) => {
							return Database()
								.then((db) => {
									var allMessages = db.get("messages");
									if(!allMessages.find( { id: ctx.params.idMessage }).value()){
										throw new MoleculerError("messages", 404, "ERR_CRITICAL", { code: 404, message: "Message doesn't exist." } );
									}
									//
									var message = new Models.Message(db_message).create();
									message.description = ctx.params.description || db_message.description;
									message.firstName = ctx.params.firstName || db_message.firstName;
									//
									return allMessages
										.find({ id: ctx.params.idMessage })
										.assign(message)
										.write()
										.then(() => {
											return message.description;
										})
										.catch(() => {
											throw new MoleculerError("messages", 500, "ERR_CRITICAL", { code: 500, message: "Critical Error." } )
										});
								})
						})
			}
		}



	}
};
