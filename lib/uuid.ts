function uuidToBytes(uuid: string): Uint8Array {
    const bytes = new Uint8Array(16);
    const hex = uuid.replace("/-/g", "");

    for (let i = 0; i < 16; i++) {
        bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }

    return bytes;
}

function bytesToUuid(bytes: Uint8Array): string {
    let uuid = "";
    for (let i = 0; i < bytes.length; i++) {
        uuid += bytes[i].toString(16).padStart(2, "0");
    }
    return `${uuid.substr(0, 8)}-${uuid.substr(8, 4)}-${uuid.substr(12, 4)}-${uuid.substr(16, 4)}-${uuid.substr(20, 12)}`;
}
