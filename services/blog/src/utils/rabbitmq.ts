import amqp from "amqplib";

export const connectRabbitMQ = async (queueName: string) => {
	try {
		const connection = await amqp.connect({
			protocol: "amqp",
			hostname: "localhost",
			port: 5672,
			username: "admin",
			password: "admin123",
		});

		const channel = await connection.createChannel();
		await channel.assertQueue(queueName, {
			durable: true,
		});

		return channel;
	} catch (error) {
		console.error("❌ Failed to connect to Rabbitmq: ", error);
	}
};
