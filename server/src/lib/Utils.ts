import crypto from 'crypto';

export function generateKeyPairBase64(): { publicKey: string; privateKey: string } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    // Flatten PEM to single line for storage
    const flattenPem = (pem: string) => pem.replace(/\r?\n/g, '');
    return {
        publicKey: flattenPem(publicKey),
        privateKey: flattenPem(privateKey)
    };
}

export function verifyPublicKey(submittedKey: string, storedKey: string): boolean {
    // Remove any line breaks to normalize
    const normalize = (key: string) => key.replace(/\r?\n/g, '').trim();
    return normalize(submittedKey) === normalize(storedKey);
}
