import { producer } from "./kafkaconfig";

export const produceMessage = async (topic: string, message: string) => {
  await producer.connect();
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  await producer.disconnect();
};

export const fetchProductsForOrder = async (orderId: string) => {
  try {
    await producer.connect(); // Ensure producer is connected before sending messages

    // Example message sending
    await producer.send({
      topic: "order-products-fetch",
      messages: [
        { key: "orderId", value: JSON.stringify({ orderId }) }
      ]
    });

    // Disconnect the producer when finished sending messages
    await producer.disconnect();
  } catch (error) {
    console.error("Error sending message to Kafka:", error);
    throw error; // Propagate the error upwards
  }
};
