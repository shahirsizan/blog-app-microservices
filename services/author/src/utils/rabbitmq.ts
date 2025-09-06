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
