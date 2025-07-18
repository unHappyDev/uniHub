/* eslint-disable @typescript-eslint/no-explicit-any */
import { version as uuidVersion } from "uuid";
import { describe, test, expect, beforeAll } from "vitest";
import orchestrator from "../../orchestrator";
import webserver from "@/infra/webserver";
import request from "supertest";
import user from "@/lib/domain/user";
import activationToken from "@/lib/domain/activation-token";
import event from "@/lib/domain/event";

const BASE_URL = webserver.host;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.resetDatabase();
});

describe("POST /api/v1/register [FIREWALL]", () => {
  describe("Anonymous user", () => {
    test("Spamming valid users", async () => {
      const response1 = await request(BASE_URL).post("/api/v1/register").send({
        username: "request1",
        email: "request1@gmail.com",
        password: "validpassword",
      });
      const response2 = await request(BASE_URL).post("/api/v1/register").send({
        username: "request2",
        email: "request2@gmail.com",
        password: "validpassword",
      });

      await orchestrator.waitForNthEmail(2);
      await orchestrator.deleteAllEmails();

      const response3 = await request(BASE_URL).post("/api/v1/register").send({
        username: "request3",
        email: "request3@gmail.com",
        password: "validpassword",
      });

      expect.soft(response1.status).toBe(201);
      expect.soft(response2.status).toBe(201);
      expect.soft(response3.status).toBe(429);

      expect(response3.body).toStrictEqual({
        error: {
          name: "TooManyRequestsError",
          message:
            "We've identified the create of many users in a short period of time, so recently created users may have been blocked",
          action:
            "Please try again later or contact support if you believe this is an error.",
          status_code: 429,
        },
      });

      const user1 = await user.getUserByUsername("request1");
      const user2 = await user.getUserByUsername("request2");

      expect(await user.getUserByUsername("request3")).toBeNull();

      expect(user1?.role).toStrictEqual("BLOCKED");
      expect(user1?.is_active).toBe(false);

      expect(user2?.role).toStrictEqual("BLOCKED");
      expect(user2?.is_active).toBe(false);

      const token1 = await activationToken.test.getActivationTokenByUserId(
        user1!.id,
      );

      const token2 = await activationToken.test.getActivationTokenByUserId(
        user2!.id,
      );

      expect(token1).not.toBeNull();
      expect(token2).not.toBeNull();

      const lastEvent = await event.test.getLastEvent();

      expect(lastEvent).toStrictEqual({
        id: lastEvent!.id,
        type: "firewall:block_users",
        originator_user_id: null,
        originator_ip: "127.0.0.1",
        metadata: {
          from_rule: "create:user",
          users: [user1!.id, user2!.id],
        },
        created_at: lastEvent!.created_at,
      });

      expect(uuidVersion(lastEvent!.id)).toBe(4);
      expect(lastEvent!.created_at).not.toBeNaN();

      const allEmails = await orchestrator.getEmails(2);
      expect(allEmails).toHaveLength(2);

      const user1Email = allEmails.find((email: any) =>
        email.recipients.includes(`<${user1!.email}>`),
      ) as {
        html: string;
        subject: string;
        text: string;
        recipients: string[];
      };

      const user2Email = allEmails.find((email: any) =>
        email.recipients.includes(`<${user2!.email}>`),
      ) as {
        html: string;
        subject: string;
        text: string;
        recipients: string[];
      };

      expect(user1Email.recipients).toStrictEqual([`<${user1!.email}>`]);
      expect(user2Email.recipients).toStrictEqual([`<${user2!.email}>`]);

      expect(user1Email.subject).toBe("Sua conta foi desativada");
      expect(user2Email.subject).toBe("Sua conta foi desativada");

      expect(user1Email.text).toContain(user1!.username);
      expect(user1Email.html).toContain(user1!.username);
      expect(user2Email.text).toContain(user2!.username);
      expect(user2Email.html).toContain(user2!.username);

      const userDeletedContentText = `Identificamos a criação de muitos usuários em um curto período, então a sua conta foi desativada.`;
      expect(user1Email.text).toContain(userDeletedContentText);
      expect(user1Email.html).toContain(userDeletedContentText);
      expect(user2Email.text).toContain(userDeletedContentText);
      expect(user2Email.html).toContain(userDeletedContentText);

      expect(user1Email.text).toContain(
        `Identificador do evento: ${lastEvent!.id}`,
      );
      expect(user1Email.html).toContain("Identificador do evento");
      expect(user1Email.html).toContain(lastEvent!.id);
      expect(user2Email.text).toContain(
        `Identificador do evento: ${lastEvent!.id}`,
      );
      expect(user2Email.html).toContain("Identificador do evento");
      expect(user2Email.html).toContain(lastEvent!.id);
    });
  });
});
