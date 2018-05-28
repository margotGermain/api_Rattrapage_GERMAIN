"use strict";

const ApiGateway = require("moleculer-web");


module.exports = {
	name: "api",
	mixins: [ ApiGateway],

	settings: {
		port: process.env.PORT || 9000,

        cors: {
            // Configures the Access-Control-Allow-Origin CORS header.
            origin: "*",
            // Configures the Access-Control-Allow-Methods CORS header.
            methods: ["GET", "PATCH", "OPTIONS", "POST", "PUT", "DELETE"],
            // Configures the Access-Control-Allow-Headers CORS header.
            allowedHeaders: ["Content-Type"],
            // Configures the Access-Control-Expose-Headers CORS header.
            exposedHeaders: [],
            // Configures the Access-Control-Allow-Credentials CORS header.
            credentials: false,
            // Configures the Access-Control-Max-Age CORS header.
            maxAge: 3600
        },

		routes: [

			{
				path: "/status/",
				whitelist: [
					
					"*"
				],
				aliases: {
					"GET server": "application.configuration",
					"GET health": "application.health",
					"GET database": "application.database",
					"GET reset": "application.reset"
				}
			},
			{
			
				bodyParsers: {
	                json: true,
	            },

				path: "/api/margot/",
				whitelist: [
					
					"*"
				],
				
				//Methods
				aliases: {
					//USER
						"POST user": "users.create",
						"GET user": "users.getAll",
						"GET user/:email": "users.get",
						"PATCH user/:email": "users.edit",
					//
					//MESSAGE
						"POST message": "messages.create",						
						"GET message": "messages.getAll",						
						"GET message/:idMessage": "messages.get",						
											
				}
			}, 
			{
				
				bodyParsers: {
	                json: true,
	            },
				path: "/client/",
				whitelist: [
					
					"*"
				],
				aliases: {
					
				}
			}
		]

	}
};
