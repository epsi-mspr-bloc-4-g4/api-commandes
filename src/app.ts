import express from "express";
import * as dotevnv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import orderRouter from "./routes/order.routes";
import { produceMessage } from "../kafka/producer";
import { consumeMessages } from "../kafka/consumer";

dotevnv.config();

if (!process.env.PORT) {
  console.log(`No port value specified...`);
}

const PORT = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use("/", orderRouter);

app.post("/kafka", async (req, res) => {
  const { topic, message } = req.body;
  await produceMessage(topic, message);
  res.send("Kafka Message published");
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
    await consumeMessages("orders");
  });
}

export default app;
