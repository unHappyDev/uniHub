import React from "react";
import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import { Button } from "@react-email/button";

export type RecoveryEmailProps = {
  username: string;
  resetLink: string;
};

export const RecoveryEmailHtml = ({
  username,
  resetLink,
}: RecoveryEmailProps) => (
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
        Recebemos uma solicitação para redefinir sua senha.
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "24px" }}>
        Clique no botão abaixo para criar uma nova senha:
      </Text>
      <Button
        href={resetLink}
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
        Redefinir senha
      </Button>
      <Text
        style={{
          color: "#666",
          fontSize: "14px",
          marginTop: "32px",
          lineHeight: "1.6",
        }}
      >
        Se você não solicitou esta alteração, pode ignorar este e-mail com
        segurança.
      </Text>
    </div>
  </Html>
);

export const RecoveryEmailText = ({
  username,
  resetLink,
}: RecoveryEmailProps): string =>
  `
Olá, ${username}!

Recebemos uma solicitação para redefinir sua senha.

Clique no link abaixo para criar uma nova senha:

${resetLink}

Se você não solicitou esta alteração, pode ignorar este e-mail com segurança.
`.trim();
