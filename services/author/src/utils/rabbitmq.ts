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

export const sendMsgToRabbitmq = async (
	queueName: string,
	cacheKeys: string[]
) => {
	try {
		const message = {
			action: "invalidateCache",
			keys: cacheKeys,
		};

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
