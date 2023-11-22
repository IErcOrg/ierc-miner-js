function uint8ToHex(uint8arr: Uint8Array) {
  let hexStr = "";
  for (let i = 0; i < uint8arr.length; i++) {
    let hex = uint8arr[i].toString(16);
    hex = hex.length === 1 ? "0" + hex : hex;
    hexStr += hex;
  }
  return ("0x" + hexStr) as `0x${string}`;
}

export function stringToHex(str: string) {
  let encoder = new TextEncoder();
  let view = encoder.encode(str);
  return uint8ToHex(view);
}

export function hexToString(hex: string) {
  return Buffer.from(hex, "hex").toString();
}

export function hexToUtf8(hex: string): string {
  if (hex.startsWith("0x")) {
    hex = hex.substring(2);
  }

  let str = "";

  for (let i = 0; i < hex.length; i += 2) {
    const byte = parseInt(hex.substr(i, 2), 16);
    str += String.fromCharCode(byte);
  }

  return decodeURIComponent(escape(str));
}

export function isAddressEqual(addr1: string, addr2: string) {
  return String(addr1).toLowerCase() === String(addr2).toLowerCase();
}

export const isHash = (hash: any) => {
  return /^0x[a-fA-F0-9]{64}$/.test(String(hash));
};
