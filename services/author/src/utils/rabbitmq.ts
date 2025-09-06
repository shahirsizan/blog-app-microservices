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

export const publishToQueue = async (queueName: string, message: any) => {
	// not necessary because we are establishing `connection` & creating `channel`
	// at the very beginning of server initialization
	// if (!channel) {
	// 	console.error("Rabbitmq channel not intialized");
	// 	return;
	// }

	await channel.assertQueue(queueName, { durable: true });

	channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
		presistent: true,
	});
};
