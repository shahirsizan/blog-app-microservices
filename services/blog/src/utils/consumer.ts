import amqp from "amqplib";
import { redisClient } from "../server.js";
import { connectRabbitMQ } from "./rabbitmq.js";
import { sql } from "./db.js";

interface messageFormat {
	action: string;
	keys: string[];
}

// this will run asynchronously in background to receive messages
export const startMessageConsumer = async () => {
	try {
		const queueName = "cache-invalidation";
		const channel = await connectRabbitMQ(queueName);
		console.log("✅ Blog Service cache consumer started.");

		channel?.consume(queueName, async (msg) => {
			if (msg) {
				try {
					const msgContent = JSON.parse(
						msg.content.toString()
					) as messageFormat;

					console.log(
						"📩 Blog service recieved cacheInvalidation message: ",
						msgContent
					);

					if (msgContent.action === "invalidateCache") {
						for (const pattern of msgContent.keys) {
							const keys = await redisClient.keys(pattern);
							if (keys.length > 0) {
								// invalidate cache in Redis
								await redisClient.del(keys);
								console.log(
									`🗑️ Blog service invalidated ${keys.length} cache keys matching: ${pattern}`
								);
								// original author of the project repopulated cache with db data.
								// we don't do that here. Giving that responsibility to the GET API calls instead.
							}
						}
						channel.ack(msg);
					}
				} catch (error) {
					channel.nack(msg, false, true);
					console.error(
						"❌ Error processing cache invalidation in blog service:",
						error
					);
				}
			}
		});
	} catch (error) {
		console.error("❌ Failed to start rabbitmq message consumer");
	}
};
