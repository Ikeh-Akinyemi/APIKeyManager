import { useState } from 'react';
import { trpc } from '../utils/trpc';

interface ExpiredKeysDetails {
  websiteUrl: string;
  name: string;
  id: number;
}

export const useKeyExpirySubscription = () => {
  const [keyExpiryData, setKeyExpiryData] = useState<ExpiredKeysDetails>({
    websiteUrl: "",
    name: "",
    id: 0
  });

  trpc.apikeys.keyExpiryNotification.useSubscription(undefined, {
    onData(data) {
      setKeyExpiryData(data);
      console.log("omoo");
    },
    onError(error) {
      console.error('Subscription error:', error);
    },
  });

  return keyExpiryData;
};
