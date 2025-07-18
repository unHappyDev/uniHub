import React from "react";
import { Html } from "@react-email/html";
import { Text } from "@react-email/text";

export type FirewallEmailProps = {
  username: string;
  sideEffectLine: string;
  eventId: string;
};

export const FirewallEmailHtml = ({
  username,
  sideEffectLine,
  eventId,
}: FirewallEmailProps) => (
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
      <Text style={{ fontSize: "16px", marginBottom: "24px" }}>
        {sideEffectLine}
      </Text>
      <Text style={{ fontSize: "16px", marginBottom: "24px" }}>
        Caso acredite que isso seja um erro, responda este e-mail para que
        possamos avaliar a situação.
      </Text>

      <Text>Identificador do evento:</Text>

      <code
        style={{
          color: "#666",
          fontSize: "14px",
          marginTop: "32px",
          lineHeight: "1.6",
        }}
      >
        {eventId}
      </code>
    </div>
  </Html>
);

export const FirewallEmailText = ({
  username,
  sideEffectLine,
  eventId,
}: FirewallEmailProps): string =>
  `
Olá, ${username}!

${sideEffectLine} Caso acredite que isso seja um erro, responda este e-mail para que possamos avaliar a situação.

Identificador do evento: ${eventId}`.trim();

export default FirewallEmailHtml;
