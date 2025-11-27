var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const ENCRYPTION_ALGORITHM = "aes-256-ctr";
// we dont want to make the nonce too long because that causes long paths which is annoying for db + tpuf performance
// nonce reuse means we leak the plaintext of the reusing path segments, which is not that bad
// so we don't have to be too paranoid here
// 6 bytes gives us 1 in a 16 million chance of having any collision
// which means there will definitely be some collisions, but they are quite unlikely
const NONCE_LENGTH = 6; // 6 bytes as requested. this becomes 8 characters in base64....
const PAD_CHAR = "\0";
const SEPARATOR_REGEX = /([./\\])/;
function generatePathEncryptionKey() {
  return crypto.randomBytes(32).toString("base64url");
}
function padString(str) {
  const padLength = (4 - str.length % 4) % 4;
  return str + PAD_CHAR.repeat(padLength);
}
function unpadString(str) {
  return str.replace(new RegExp(`${PAD_CHAR}+$`), "");
}
function deriveKeys(masterKey) {
  const macKey = external_node_crypto_.createHash("sha256").update(masterKey).update(Buffer.from([0])).digest();
  const encKey = external_node_crypto_.createHash("sha256").update(masterKey).update(Buffer.from([1])).digest();
  return {
    macKey,
    encKey
  };
}
class V1MasterKeyedEncryptionScheme {
  constructor(masterKeyRaw) {
    this.masterKeyRaw = masterKeyRaw;
    const masterKey = Buffer.from(masterKeyRaw, "base64url");
    const {
      macKey,
      encKey
    } = deriveKeys(masterKey);
    this.macKey = macKey;
    this.encKey = encKey;
  }
  exportKey() {
    return this.masterKeyRaw;
  }
  encrypt(value) {
    // Create synthetic nonce
    const hmac = external_node_crypto_.createHmac("sha256", this.macKey);
    hmac.update(value);
    const nonce = hmac.digest().subarray(0, NONCE_LENGTH);
    // Expand nonce by two null bytes
    const expandedNonce = Buffer.concat([nonce, Buffer.alloc(10)]);
    // Encrypt
    const cipher = external_node_crypto_.createCipheriv(ENCRYPTION_ALGORITHM, this.encKey, expandedNonce);
    let encrypted = cipher.update(padString(value), "utf8", "base64url");
    encrypted += cipher.final("base64url");
    // Include original nonce in the ciphertext
    return Buffer.concat([nonce, Buffer.from(encrypted, "base64url")]).toString("base64url");
  }
  decrypt(value) {
    const encryptedBuffer = Buffer.from(value, "base64url");
    // Extract nonce from the ciphertext
    const nonce = encryptedBuffer.subarray(0, NONCE_LENGTH);
    // Expand nonce by two null bytes
    const expandedNonce = Buffer.concat([nonce, Buffer.alloc(10)]);
    const ciphertext = encryptedBuffer.subarray(NONCE_LENGTH).toString("base64url");
    // Decrypt
    const decipher = external_node_crypto_.createDecipheriv(ENCRYPTION_ALGORITHM, this.encKey, expandedNonce);
    let decrypted = decipher.update(ciphertext, "base64url", "utf8");
    decrypted += decipher.final("utf8");
    return unpadString(decrypted);
  }
}
class PlainTextEncryptionScheme {
  exportKey() {
    return "";
  }
  encrypt(value) {
    return value;
  }
  decrypt(value) {
    return value;
  }
}
function encryptPath(path, scheme) {
  return path.split(SEPARATOR_REGEX).map(segment => {
    if (SEPARATOR_REGEX.test(segment)) {
      return segment;
    }
    if (segment === "") {
      return segment;
    }
    return scheme.encrypt(segment);
  }).join("");
}
function decryptPath(path, scheme) {
  return path.split(SEPARATOR_REGEX).map(segment => {
    if (SEPARATOR_REGEX.test(segment)) {
      return segment;
    }
    if (segment === "") {
      return segment;
    }
    return scheme.decrypt(segment);
  }).join("");
}
function isEncryptionAvailable() {
  // try encrypting and decrypting and checking that it works
  try {
    const key = generatePathEncryptionKey();
    const path = "/home/user/Documents/myfile.txt";
    const scheme = new V1MasterKeyedEncryptionScheme(key);
    const encrypted = encryptPath(path, scheme);
    const decrypted = decryptPath(encrypted, scheme);
    return encrypted !== path && decrypted === path;
  } catch (_e) {
    return false;
  }
}
function negotiateEncryptionScheme() {
  if (isEncryptionAvailable()) {
    const key = generatePathEncryptionKey();
    return {
      schemeIdentifier: "aes-256-ctr",
      scheme: new V1MasterKeyedEncryptionScheme(key),
      key: key
    };
  }
  return {
    schemeIdentifier: "plaintext",
    scheme: new PlainTextEncryptionScheme(),
    key: ""
  };
}
function loadEncryptionScheme(encryptionScheme, key) {
  if (encryptionScheme === "aes-256-ctr") {
    return new V1MasterKeyedEncryptionScheme(key);
  }
  return new PlainTextEncryptionScheme();
}
function readPathKeyFromWorkspace(workspaceUris) {
  return __awaiter(this, void 0, void 0, function* () {
    const roots = Object.values(workspaceUris).sort((a, b) => a.localeCompare(b));
    let keyMaterial = "";
    // Combine keys in all workspaces into one single key.  If any workspace has a key,
    // we will return a custom key here.  If none of them do, we will use the default key.
    for (const root of roots) {
      try {
        const keysPath = path.join(root, ".cursor", "keys");
        const keysContent = fs.readFileSync(keysPath, "utf8");
        const keys = JSON.parse(keysContent);
        if (typeof keys.path_encryption_key === "string") {
          keyMaterial += keys.path_encryption_key;
        }
      } catch (_e) {
        // File doesn't exist or isn't valid JSON
      }
    }
    if (keyMaterial !== "") {
      return keyMaterial;
    }
    return undefined;
  });
}