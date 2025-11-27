const decoder = new TextDecoder();
const encoder = new TextEncoder();
class Utf8Serde {
  serialize(value) {
    return encoder.encode(value);
  }
  deserialize(blob) {
    return decoder.decode(blob);
  }
}
const utf8Serde = new Utf8Serde();
class ProtoSerde {
  constructor(proto) {
    this.proto = proto;
  }
  serialize(value) {
    return value.toBinary();
  }
  deserialize(blob) {
    return this.proto.fromBinary(blob);
  }
}
function serde_toHex(u8) {
  return Array.from(u8, b => b.toString(16).padStart(2, "0")).join("");
}
function fromHex(hex) {
  const clean = hex.trim().toLowerCase();
  if (clean.length % 2 !== 0) throw new Error("Invalid hex string length");
  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    out[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return out;
}
function toBase64(u8) {
  return Buffer.from(u8).toString("base64");
}
function fromBase64(base64) {
  return new Uint8Array(Buffer.from(base64, "base64"));
}