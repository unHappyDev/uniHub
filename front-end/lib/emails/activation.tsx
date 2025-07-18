import React from "react";
import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import { Button } from "@react-email/button";

export type ActivationEmailProps = {
  username: string;
  activationLink: string;
};

export const ActivationEmailHtml = ({
  username,
  activationLink,
}: ActivationEmailProps) => (
  <Html>
    <div
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        padding: "40px 24px",
        border: "1px solid #eaeaea",
        borderRadius: "12px",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        backgroundColor: "#fff",
        textAlign: "center",
      }}
    >
      <Text style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
        Olá, {username}!
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "16px" }}>
        Bem-vindo ao AuthSample.
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "24px" }}>
        Ative sua conta clicando no botão abaixo:
      </Text>
      <Button
        href={activationLink}
        style={{
          backgroundColor: "#000",
          color: "#fff",
          padding: "12px 24px",
          borderRadius: "8px",
          fontWeight: 500,
          fontSize: "16px",
          textDecoration: "none",
        }}
      >
        Ativar conta
      </Button>
      <Text
        style={{
          color: "#666",
          fontSize: "14px",
          marginTop: "32px",
          lineHeight: "1.6",
        }}
      >
        Se você não solicitou este cadastro, pode ignorar este e-mail.
      </Text>
    </div>
  </Html>
);

export const ActivationEmailText = ({
  username,
  activationLink,
}: ActivationEmailProps): string =>
  `
Olá, ${username}!

Bem-vindo ao AuthSample.

Para ativar sua conta, clique no link abaixo:

${activationLink}

Se você não solicitou este cadastro, pode ignorar este e-mail.
`.trim();
