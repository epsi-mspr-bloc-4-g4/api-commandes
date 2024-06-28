import { consumer } from "./kafkaconfig";

interface KafkaMessage {
  topic: string;
  partition: number;
  offset: string;
  value: string;
}

let isRunning = false;
let messages: KafkaMessage[] = [];

export const consumeMessages = async (topic: string): Promise<KafkaMessage[]> => {
  if (isRunning) {
    console.log("Consumer is already running");
    return messages;
  }

  await consumer.connect();
  await consumer.subscribe({ topic });

  console.log("START?");
  isRunning = true;
  messages = []; // Reset messages for each new consumption

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      messages.push({
        topic,
        partition,
        offset: message.offset,
        value: message.value?.toString() || "",
      });
    },
  });

  console.log("END?");
  return messages;
};
