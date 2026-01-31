import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const KEY = process.env.ENCRYPTION_KEY || "";

/**
 * Encrypts a string using AES-256-CBC
 */
export function encrypt(text: string): string {
    if (!KEY || KEY.length !== 64) {
        throw new Error("ENCRYPTION_KEY must be a 64-character hex string (32 bytes)");
    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(KEY, "hex"), iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return `${iv.toString("hex")}:${encrypted}`;
}

/**
 * Decrypts a string using AES-256-CBC
 */
export function decrypt(hash: string): string {
    if (!KEY || KEY.length !== 64) {
        throw new Error("ENCRYPTION_KEY must be a 64-character hex string (32 bytes)");
    }

    const [ivHex, encryptedText] = hash.split(":");
    if (!ivHex || !encryptedText) {
        throw new Error("Invalid encrypted format");
    }

    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(KEY, "hex"), iv);

    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
}
