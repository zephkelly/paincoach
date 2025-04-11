export interface EncryptionKey {
    id: string;
    value: string;
    isExpiring?: boolean;
    expiryDate?: Date;
}

export interface EncryptedData {
    encryptedData: string;
    encryptedDataKey: string;
    keyId: string;
    iv: string;
}