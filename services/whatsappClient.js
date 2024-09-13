import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

const client = new Client({
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
  webVersionCache: {
    type: "remote",
    remotePath:
      "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
  },
  authStrategy: new LocalAuth(),
});

let qrcodeData = null;
let orderState = {};

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("qr", (qr) => {
  qrcodeData = qr;
  console.log("QR code received", qr);
});

client.on("message", async (message) => {
  try {
    if (message.from != "status@broadcast" && !message.from.endsWith("@g.us")) {
      console.log(`Received message: ${message.body}`);
      await handleIncomingMessage(message);
    }
  } catch (error) {
    console.log(error);
  }
});

const handleIncomingMessage = async (message) => {
  const phoneNumber = message.from;
  const text = message.body.trim();
  let response = "";

  if (!orderState[phoneNumber]) {
    if (text === "1") {
      response =
        "Aqui está nosso menu:\n1. Margherita - R$25\n2. Pepperoni - R$30\n3. Portuguesa - R$28\n4. Calabresa - R$27\n5. Quatro Queijos - R$32\n\nDigite o número da pizza que você deseja pedir.";
      orderState[phoneNumber] = { step: "menu" };
    } else {
      response =
        'Bem-vindo ao bot da Pizzaria!\nDigite "1" para ver o menu e fazer um pedido.';
    }
  } else if (orderState[phoneNumber].step === "menu") {
    const pizzaMenu = {
      1: "Margherita",
      2: "Pepperoni",
      3: "Portuguesa",
      4: "Calabresa",
      5: "Quatro Queijos",
    };

    if (pizzaMenu[text]) {
      orderState[phoneNumber].pizza = pizzaMenu[text];
      response = `Você escolheu ${pizzaMenu[text]}. Para confirmar seu pedido, digite "2". Para cancelar, digite "3".`;
      orderState[phoneNumber].step = "confirm";
    } else {
      response =
        "Opção inválida. Por favor, escolha uma pizza digitando o número correspondente:\n1. Margherita - R$25\n2. Pepperoni - R$30\n3. Portuguesa - R$28\n4. Calabresa - R$27\n5. Quatro Queijos - R$32";
    }
  } else if (orderState[phoneNumber].step === "confirm") {
    if (text === "2") {
      response = `Seu pedido de ${orderState[phoneNumber].pizza} foi confirmado! Em breve enviaremos uma confirmação.`;
      delete orderState[phoneNumber];
    } else if (text === "3") {
      response = "Seu pedido foi cancelado.";
      delete orderState[phoneNumber];
    } else {
      response = `Você escolheu ${orderState[phoneNumber].pizza}. Para confirmar seu pedido, digite "2". Para cancelar, digite "3".`;
    }
  }

  await client.sendMessage(phoneNumber, response);
};

const getQRCode = () => qrcodeData;
export default { client, getQRCode };
