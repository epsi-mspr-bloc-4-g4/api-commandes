import { consumer } from "./kafkaconfig";
import * as dotevnv from "dotenv";

dotevnv.config();

interface KafkaMessage {
  topic: string;
  partition: number;
  offset: string;
  value: string;
}

let isRunning = false;
let messages: KafkaMessage[] = [];

export const consumeMessages = async (
  topic: string
): Promise<KafkaMessage[]> => {
  if (isRunning) {
    return messages;
  }

  await consumer.connect();
  await consumer.subscribe({ topic: topic, fromBeginning: true });

  console.log("START?");
  isRunning = true;
  messages = [];

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      messages.push({
        topic: topic,
        partition: partition,
        offset: message.offset,
        value: message.value?.toString() || "",
      });
    },
  });

  await new Promise((resolve) =>
    setTimeout(resolve, Number(process.env.DEFAULT_SET_TIMEOUT))
  ); // attendre 5 secondes

  return messages;
};
