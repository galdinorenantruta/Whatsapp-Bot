import express from "express";
import whatsappClient from "../services/whatsappClient.js";

const { client, getQRCode } = whatsappClient;

const router = new express.Router();

router.get("/", (req, res) => {
  res.send("Olá mundo!!");
});

router.get("/qr", async (req, res) => {
  const qrCode = await getQRCode();
  res.send(qrCode);
});
export default router;
