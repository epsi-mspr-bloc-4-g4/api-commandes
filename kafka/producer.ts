import { producer } from "./kafkaconfig";

export const produceMessage = async (topic: string, message: string) => {
  await producer.connect();
  await producer.send({
    topic: topic,
    messages: [{ value: message }],
  });
  await producer.disconnect();
};
