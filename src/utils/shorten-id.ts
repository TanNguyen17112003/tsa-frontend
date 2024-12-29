export const shortenUUID = (uuid: string, type: 'ORDER' | 'DELIVERY') => {
  return `#${type === 'ORDER' ? 'TSA' : 'DELI'}${uuid?.slice(uuid.length - 6, uuid.length).toUpperCase()}`;
};
