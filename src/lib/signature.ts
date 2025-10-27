import crypto from "crypto";

export function generateSign(params: Record<string, any>, privateKey: string) {
  const filtered = Object.entries(params)
    .filter(([k, v]) => k !== "sign" && v !== "" && v !== undefined && v !== null)
    .sort(([a], [b]) => a.localeCompare(b));
  const query = filtered.map(([k, v]) => `${k}=${v}`).join("&");
  const stringSign = query + "&key=" + privateKey;
  return crypto.createHash("md5").update(stringSign).digest("hex").toLowerCase();
}

export function verifySign(params: Record<string, any>, privateKey: string) {
  const expectedSign = generateSign(params, privateKey);
  return expectedSign === params.sign?.toLowerCase();
}