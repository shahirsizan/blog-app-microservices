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

// FOR: https://cloud.redis.io/#/databases/13539766/subscription/2900968/view-bdb/configuration
import { createClient } from "redis";

export const runRedis = async () => {
	const redisClient = createClient({
		username: "default",
		password: "GAtHUHUlXWtO8arWLbaNeKuuaW3eM4Pf",
		socket: {
			host: "redis-15670.crce182.ap-south-1-1.ec2.redns.redis-cloud.com",
			port: 15670,
		},
	});

	redisClient.on("error", (err) => console.log("Redis Client Error", err));

	await redisClient.connect();
	return redisClient;
};
