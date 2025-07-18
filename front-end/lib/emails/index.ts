import { render } from "@react-email/render";

import {
  ActivationEmailHtml,
  ActivationEmailText,
  ActivationEmailProps,
} from "./activation";
// import {
//   ConfirmationEmailHtml,
//   ConfirmationEmailText,
//   ConfirmationEmailProps,
// } from "./confirmation";
import {
  FirewallEmailHtml,
  FirewallEmailText,
  FirewallEmailProps,
} from "./firewall";
// import {
//   NotificationEmailHtml,
//   NotificationEmailText,
//   NotificationEmailProps,
// } from "./notification";
import {
  RecoveryEmailHtml,
  RecoveryEmailText,
  RecoveryEmailProps,
} from "./recovery";

type EmailTemplate<P> = (props: P) => Promise<{ html: string; text: string }>;

export const ActivationEmail: EmailTemplate<ActivationEmailProps> = async (
  props,
) => {
  const html = await render(ActivationEmailHtml(props));
  const text = ActivationEmailText(props);

  return { html, text };
};

export const RecoveryEmail: EmailTemplate<RecoveryEmailProps> = async (
  props,
) => {
  const html = await render(RecoveryEmailHtml(props));
  const text = RecoveryEmailText(props);

  return { html, text };
};

export const FirewallEmail: EmailTemplate<FirewallEmailProps> = async (
  props,
) => {
  const html = await render(FirewallEmailHtml(props));
  const text = FirewallEmailText(props);

  return { html, text };
};
