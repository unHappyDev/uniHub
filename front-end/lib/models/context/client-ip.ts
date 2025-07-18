import { isInSubnet, isIP } from "is-in-subnet";
import webserver from "@/infra/webserver";

function getClientIpFromRequest(request: Request): string {
  if (isRequestFromCloudflare(request)) {
    return request.headers.get("cf-connecting-ip") || "";
  }

  let realIp = webserver.isServerlessRuntime
    ? request.headers.get("x-vercel-proxied-for")?.split(", ").at(-1) || "" // Vercel
    : request.headers.get("x-forwarded-for")?.split(", ").at(-1) || ""; // remote development

  if (!webserver.isServerlessRuntime) {
    // Localhost loopback in IPv6
    if (realIp === "::1") {
      realIp = "127.0.0.1";
    }

    // IPv4-mapped IPv6 addresses
    if (realIp.startsWith("::ffff:")) {
      realIp = realIp.substring(7); // 7 is length of '::ffff:'
    }
  }

  return realIp;
}

function isRequestFromCloudflare(request: Request) {
  const proxyIp =
    request.headers.get("x-vercel-proxied-for")?.split(", ").at(-1) || "";

  return !!isIP(proxyIp) && isInSubnet(proxyIp, cloudflareIPs);
}

const cloudflareIPs = [
  "172.64.0.0/13",
  "162.158.0.0/15",
  "108.162.192.0/18",
  "198.41.128.0/17",
  "173.245.48.0/20",
  "103.21.244.0/22",
  "103.22.200.0/22",
  "103.31.4.0/22",
  "141.101.64.0/18",
  "190.93.240.0/20",
  "188.114.96.0/20",
  "197.234.240.0/22",
  "104.16.0.0/13",
  "104.24.0.0/14",
  "131.0.72.0/22",
  "2400:cb00::/32",
  "2606:4700::/32",
  "2803:f800::/32",
  "2405:b500::/32",
  "2405:8100::/32",
  "2a06:98c0::/29",
  "2c0f:f248::/32",
];

const clientIp = {
  getClientIpFromRequest,
};

export default clientIp;
