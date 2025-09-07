import amqp from "amqplib";

let channel: any;

export const connectRabbitMQ = async () => {
	try {
		const connection = await amqp.connect({
			protocol: "amqp",
			hostname: "localhost",
			port: 5672,
			username: "admin",
			password: "admin123",
		});

		channel = await connection.createChannel();

		console.log("✅ Connected to Rabbitmq");
	} catch (error) {
		console.error("❌ Failed to connect to Rabbitmq: ", error);
	}
};

// Below function not needed. We implement it inside the invalidateChacheJob() directly.
// export const publishToQueue = async (queueName: string, message: any) => {
// 	// not necessary because we are establishing `connection` & creating `channel`
// 	// at the very beginning of server initialization
// 	// if (!channel) {
// 	// 	console.error("Rabbitmq channel not intialized");
// 	// 	return;
// 	// }

// 	await channel.assertQueue(queueName, { durable: true });

// 	channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
// 		presistent: true,
// 	});
// };

export const invalidateCacheJob = async (cacheKeys: string[]) => {
	try {
		const message = {
			action: "invalidateCache",
			keys: cacheKeys,
		};

		// await publishToQueue(queueName, message);

		// `assertQueue()` creates a new queue if one with provided name doesn't already exist.
		// If a queue already exists, the command has no effect as long as the properties
		// you provide (like durable) are the same. If the queue exists but has different properties,
		// the channel will be closed and an error will be thrown.
		//This behavior makes assertQueue() idempotent, meaning you can call it
		// multiple times without unintended side effects.
		const queueName = "cache-invalidation";
		await channel.assertQueue(queueName, {
			durable: true,
		});

		channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
			presistent: true,
		});

		console.log("✅ invalidateCacheJob pushed to Rabbitmq");
	} catch (error) {
		console.error(
			"❌ Failed to push invalidateCacheJob to Rabbitmq: ",
			error
		);
	}
};
