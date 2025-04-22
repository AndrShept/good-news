import { render } from '@react-email/components';
import nodemailer from 'nodemailer';

import z from 'zod';

const schema = z.object({
  DATABASE_URL: z.string(),
  BREVO_USERNAME: z.string(),
  BREVO_PASS: z.string(),
  PORT: z.string(),
  JWT_SECRET: z.string(),
  BASE_URL_FRONT: z.string(),
});
export const processEnv = schema.parse(process.env);

interface ISendEmail {
  to: string;
  subject: string;
  text?: string;
  reactElement: any;
}

export const sendEmail = async ({ to, subject, text = '', reactElement }: ISendEmail) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587, // або 465 для SSL
    secure: false, // true якщо порт 465
    auth: {
      user: processEnv.BREVO_USERNAME,
      pass: processEnv.BREVO_PASS,
    },
  });

  const emailHtml = await render(reactElement);

  await transporter.sendMail({
    from: '"Good News" <no-reply@good-news.space>', // рекомендовано свій домен
    to,
    subject,
    text,
    html: emailHtml,
  });
};
