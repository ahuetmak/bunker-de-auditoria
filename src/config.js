import "dotenv/config";

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  hiveKey: process.env.HIVE_KEY || "",
  seUser: process.env.SE_USER || "",
  seKey: process.env.SE_KEY || "",
};

export function validateConfig() {
  const missing = [];
  if (!config.hiveKey) missing.push("HIVE_KEY");
  if (!config.seUser) missing.push("SE_USER");
  if (!config.seKey) missing.push("SE_KEY");
  return { valid: missing.length === 0, missing };
}
