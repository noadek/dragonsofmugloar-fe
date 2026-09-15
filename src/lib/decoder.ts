// if encryption code is 1, the message is base64 encoded
// if encryption code is 2, the message is ROT13

import { Message } from '@/services/game.type';

function decodeString(message: string, encryptionCode: number | null): string {
  switch (encryptionCode) {
    case 1:
      return Buffer.from(message, 'base64').toString('utf-8');
    case 2:
      return message.replace(/[A-Za-z]/g, (c) => {
        const limit = c <= 'Z' ? 90 : 122;
        const code = c.charCodeAt(0) + 13;

        return String.fromCharCode(code <= limit ? code : code - 26);
      });
    default:
      return message;
  }
}

export function decodeMessages(message: Message): Message {
  return {
    ...message,
    adId: decodeString(message.adId, message.encrypted),
    message: decodeString(message.message, message.encrypted),
    probability: decodeString(message.probability, message.encrypted),
  };
}
