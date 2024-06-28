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
  const message =  orderId ;
  await produceMessage('order-products-fetch', message);
};
