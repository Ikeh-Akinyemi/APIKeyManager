import { useEffect } from 'react';
import { useKeyExpirySubscription } from '../../hooks/useKeyExpirySubscription';
import { toast } from 'react-toastify';

const KeyExpiryAlerts = () => {
  const keyExpiryData = useKeyExpirySubscription();

  useEffect(() => {
    if (keyExpiryData.name !== "") {
      toast.warn(`Your key "${keyExpiryData.name}" is expiring soon. Please renew it.`);
    }
  }, [keyExpiryData]);

  return null; // This component will not render anything itself
};

export default KeyExpiryAlerts;