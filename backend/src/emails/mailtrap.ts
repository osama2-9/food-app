import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;

export const client = new MailtrapClient({ token: TOKEN });

interface Sender {
  email: string;
  name: string;
}

export const sender: Sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Chef App",
};
