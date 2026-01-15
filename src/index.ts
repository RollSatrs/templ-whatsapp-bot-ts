import pkg from 'whatsapp-web.js';
import QRCode from 'qrcode';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { text } from './constante/text';

const db = drizzle(process.env.DATABASE_URL!);

const { Client, LocalAuth } = pkg;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true }
});

client.on('qr', (qr: string) => {
  console.log('QR получен, отсканируйте в WhatsApp:');
  const qrText = QRCode.toString(qr, {type: "terminal", small: true}).then(qr =>{
    console.log(qr)
  }).catch(err =>{
    console.error(err)
  })
  console.log(qrText)
});

client.on('ready', () => {
  console.log(text);
});

client.on('message', async (msg) => {
  if (msg.body.toLowerCase() === 'привет') {
    await client.sendMessage(msg.from, 'Привет! 👋', { sendSeen: false });
  }
});

client.initialize();
