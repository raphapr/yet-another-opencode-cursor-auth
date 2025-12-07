/**
 * Test script to fetch available models from Cursor's GetUsableModels API
 */

import { FileCredentialManager } from "../src/lib/storage";

const API_BASE = "https://api2.cursor.sh";

// Proto field numbers for GetUsableModelsRequest/Response
// GetUsableModelsRequest:
//   field 1: custom_model_ids (repeated string)
// GetUsableModelsResponse:
//   field 1: models (repeated ModelDetails)
// ModelDetails:
//   field 1: model_id (string)
//   field 2: thinking_details (message)
//   field 3: display_model_id (string)
//   field 4: display_name (string)
//   field 5: display_name_short (string)
//   field 6: aliases (repeated string)
//   field 7: max_mode (bool)
//   field 8: api_key_credentials (message)

function encodeVarint(value: number): number[] {
  const bytes: number[] = [];
  while (value > 0x7f) {
    bytes.push((value & 0x7f) | 0x80);
    value >>>= 7;
  }
  bytes.push(value);
  return bytes;
}

function decodeVarint(bytes: Uint8Array, offset: number): { value: number; newOffset: number } {
  let value = 0;
  let shift = 0;
  let pos = offset;
  
  while (pos < bytes.length) {
    const byte = bytes[pos];
    value |= (byte & 0x7f) << shift;
    pos++;
    if ((byte & 0x80) === 0) break;
    shift += 7;
  }
  
  return { value, newOffset: pos };
}

function decodeString(bytes: Uint8Array, offset: number): { value: string; newOffset: number } {
  const { value: length, newOffset: dataStart } = decodeVarint(bytes, offset);
  const value = new TextDecoder().decode(bytes.slice(dataStart, dataStart + length));
  return { value, newOffset: dataStart + length };
}

interface ModelDetails {
  modelId: string;
  displayModelId: string;
  displayName: string;
  displayNameShort: string;
  aliases: string[];
  maxMode?: boolean;
}

function parseModelDetails(bytes: Uint8Array, start: number, end: number): ModelDetails {
  const model: ModelDetails = {
    modelId: "",
    displayModelId: "",
    displayName: "",
    displayNameShort: "",
    aliases: [],
  };
  
  let pos = start;
  while (pos < end) {
    const { value: tag, newOffset: afterTag } = decodeVarint(bytes, pos);
    const fieldNumber = tag >>> 3;
    const wireType = tag & 0x7;
    pos = afterTag;
    
    if (wireType === 2) { // Length-delimited
      const { value: str, newOffset } = decodeString(bytes, pos);
      pos = newOffset;
      
      switch (fieldNumber) {
        case 1: model.modelId = str; break;
        case 3: model.displayModelId = str; break;
        case 4: model.displayName = str; break;
        case 5: model.displayNameShort = str; break;
        case 6: model.aliases.push(str); break;
        // Skip other fields (like thinking_details)
      }
    } else if (wireType === 0) { // Varint
      const { value, newOffset } = decodeVarint(bytes, pos);
      pos = newOffset;
      
      if (fieldNumber === 7) {
        model.maxMode = value === 1;
      }
    }
  }
  
  return model;
}

function parseGetUsableModelsResponse(bytes: Uint8Array): ModelDetails[] {
  const models: ModelDetails[] = [];
  let pos = 0;
  
  while (pos < bytes.length) {
    const { value: tag, newOffset: afterTag } = decodeVarint(bytes, pos);
    const fieldNumber = tag >>> 3;
    const wireType = tag & 0x7;
    pos = afterTag;
    
    if (fieldNumber === 1 && wireType === 2) {
      // Field 1 = models (repeated ModelDetails)
      const { value: length, newOffset: dataStart } = decodeVarint(bytes, pos);
      const model = parseModelDetails(bytes, dataStart, dataStart + length);
      models.push(model);
      pos = dataStart + length;
    } else if (wireType === 2) {
      // Skip unknown length-delimited field
      const { value: length, newOffset } = decodeVarint(bytes, pos);
      pos = newOffset + length;
    } else if (wireType === 0) {
      // Skip unknown varint
      const { newOffset } = decodeVarint(bytes, pos);
      pos = newOffset;
    }
  }
  
  return models;
}

async function fetchUsableModels(accessToken: string): Promise<ModelDetails[]> {
  // GetUsableModelsRequest is empty (or has optional custom_model_ids)
  // Just send an empty message
  const requestBody = new Uint8Array([]);
  
  // Add gRPC-Web frame (0 = uncompressed, followed by 4-byte length)
  const framedBody = new Uint8Array(5 + requestBody.length);
  framedBody[0] = 0; // compression flag
  const len = requestBody.length;
  framedBody[1] = (len >> 24) & 0xff;
  framedBody[2] = (len >> 16) & 0xff;
  framedBody[3] = (len >> 8) & 0xff;
  framedBody[4] = len & 0xff;
  framedBody.set(requestBody, 5);
  
  const url = `${API_BASE}/aiserver.v1.AiService/GetUsableModels`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/grpc-web+proto",
      "Authorization": `Bearer ${accessToken}`,
      "x-cursor-client-version": "cli-2025.11.25-d5b3271",
      "x-ghost-mode": "false",
      "x-request-id": crypto.randomUUID(),
    },
    body: framedBody,
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GetUsableModels failed: ${response.status} - ${text}`);
  }
  
  const responseBuffer = await response.arrayBuffer();
  const responseBytes = new Uint8Array(responseBuffer);
  
  // Parse gRPC-Web response
  // Frame format: 1 byte compression flag + 4 byte length + data
  if (responseBytes.length < 5) {
    throw new Error("Response too short");
  }
  
  const compressionFlag = responseBytes[0];
  const messageLength = (responseBytes[1] << 24) | (responseBytes[2] << 16) | (responseBytes[3] << 8) | responseBytes[4];
  
  if (compressionFlag !== 0) {
    throw new Error("Compressed responses not supported");
  }
  
  const messageData = responseBytes.slice(5, 5 + messageLength);
  return parseGetUsableModelsResponse(messageData);
}

async function main() {
  const cm = new FileCredentialManager("cursor");
  const accessToken = await cm.getAccessToken();
  
  if (!accessToken) {
    console.error("No access token found");
    process.exit(1);
  }
  
  console.log("Fetching available models from Cursor API...\n");
  
  try {
    const models = await fetchUsableModels(accessToken);
    
    console.log(`Found ${models.length} models:\n`);
    
    for (const model of models) {
      console.log(`- ${model.displayModelId || model.modelId}`);
      if (model.displayName) console.log(`  Display Name: ${model.displayName}`);
      if (model.displayNameShort) console.log(`  Short Name: ${model.displayNameShort}`);
      if (model.aliases.length > 0) console.log(`  Aliases: ${model.aliases.join(", ")}`);
      if (model.maxMode) console.log(`  Max Mode: enabled`);
      console.log();
    }
    
    // Output as JSON for easy copy
    console.log("\n--- JSON Output ---");
    console.log(JSON.stringify(models, null, 2));
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

main();
