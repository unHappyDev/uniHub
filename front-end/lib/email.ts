import nodemailer from "nodemailer";
import { ActivationEmail, FirewallEmail, RecoveryEmail } from "./emails/index";
import webserver from "@/infra/webserver";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST,
  port: parseInt(process.env.EMAIL_SMTP_PORT || "587"),
  secure: webserver.isServerlessRuntime,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface SendActivationEmailParams {
  to: string;
  username: string;
  activationToken: string;
}

export const sendActivationEmail = async ({
  to,
  username,
  activationToken,
}: SendActivationEmailParams) => {
  try {
    const activationLink = `${webserver.host}/activate?token=${activationToken}`;

    const { html, text } = await ActivationEmail({
      username,
      activationLink,
    });

    const mailOptions = {
      from: `"AuthSample" <contato@authsample.com>`,
      to,
      subject: "Ative seu cadastro no AuthSample",
      text,
      html: html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending activation email:", error);
    throw new Error("Failed to send activation email");
  }
};

interface SendRecoveryEmailParams {
  to: string;
  username: string;
  recoveryToken: string;
}

export const sendRecoveryEmail = async ({
  to,
  username,
  recoveryToken,
}: SendRecoveryEmailParams) => {
  try {
    const resetLink = `${webserver.host}/reset-password?token=${recoveryToken}`;

    const { html, text } = await RecoveryEmail({
      username,
      resetLink,
    });

    const mailOptions = {
      from: `"AuthSample" <contato@authsample.com>`,
      to,
      subject: "Redefina sua senha no AuthSample",
      text,
      html: html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending recovery email:", error);
    throw new Error("Failed to send recovery email");
  }
};

interface SendFirewallEmailParams {
  to: string;
  username: string;
  eventId: string;
}

export const sendFirewallEmail = async ({
  to,
  eventId,
  username,
}: SendFirewallEmailParams) => {
  try {
    const { html, text } = await FirewallEmail({
      sideEffectLine:
        "Identificamos a criação de muitos usuários em um curto período, então a sua conta foi desativada.",
      eventId: eventId,
      username: username,
    });

    const mailOptions = {
      from: `"AuthSample" <contato@authsample.com>`,
      to,
      subject: "Sua conta foi desativada",
      text,
      html: html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending firewall email:", error);
    throw new Error("Failed to send firewall email");
  }
};
