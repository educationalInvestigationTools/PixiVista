export function generateRandomString(lengthMin: number, lengthMax: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charCount = chars.length;

    // Random length between min and max (inclusive)
    const length = Math.floor(Math.random() * (lengthMax - lengthMin + 1)) + lengthMin;

    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charCount);
        result += chars[randomIndex];
    }
    return result;
}
