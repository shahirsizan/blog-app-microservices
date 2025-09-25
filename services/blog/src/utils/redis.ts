// FOR: https://console.upstash.com/redis/ad246970-d9a8-475d-8c20-e250599f4e38?teamid=0
// import { createClient } from "redis";

// export const runRedis = async () => {
// 	const redisClient = createClient({
// 		url: process.env.REDIS_URL,
// 	});

// 	await redisClient.connect();
// 	const isReady = redisClient.isReady;
// 	console.log("redisClient ready: ", isReady);

// 	redisClient.on("error", (err) => {
// 		console.log("blog -> server.ts: ", err);
// 	});
// 	console.log("Connected to redis.");
// };

// //////////////////////////////////////////////////////////////////////////////////////////////////
// FOR: https://cloud.redis.io/#/databases/13539766/subscription/2900968/view-bdb/configuration
// import { createClient } from "redis";

// export const runRedis = async () => {
// 	const redisClient = createClient({
// 		username: "default",
// 		password: "aKjwv9v2JH4fOfo71zSGL8foCwC37CSw",
// 		socket: {
// 			host: "redis-15207.c257.us-east-1-3.ec2.redns.redis-cloud.com",
// 			port: 15207,
// 		},
// 	});

// 	redisClient.on("error", (err) => console.log("❌ Redis Client Error", err));

// 	await redisClient.connect();
// 	return redisClient;
// };

///////////////////////////////////////////

import { createClient } from "redis";

export const runRedis = async () => {
	console.log("in runRedis");

	const redisClient = createClient({
		username: "default",
		password: "aKjwv9v2JH4fOfo71zSGL8foCwC37CSw",
		socket: {
			host: "redis-15207.c257.us-east-1-3.ec2.redns.redis-cloud.com",
			port: 15207,
		},
	});

	redisClient.on("error", (err) => console.log("❌Redis Client Error", err));

	await redisClient.connect();

	await redisClient.set("foo", "sizan");
	const result = await redisClient.get("foo");
	console.log("result: ", result); // >>> bar
};
