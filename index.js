import express from "express";
import cors from "cors";
import messageRouter from "./routes/messageRouter.js";
import whatsappClient from "./services/whatsappClient.js";

const { client } = whatsappClient;

client.initialize();

const app = express();

app.use(cors());

app.use(express.json());
app.use(messageRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("server is ready");
});

export default app;
