import NodeCache from 'node-cache';

// Cache with 15 minute TTL
export const cache = new NodeCache({ stdTTL: 900 });
