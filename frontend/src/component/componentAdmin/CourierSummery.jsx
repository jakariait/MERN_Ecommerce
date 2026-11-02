import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const CourierSummery = ({ phone }) => {
  const [courierData, setCourierData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleFetch = async () => {
    if (!phone) {
      setError('No phone number provided.');
      return;
    }

    setLoading(true);
    setError('');
    setCourierData(null);

    try {
      const response = await axios.post(`${apiUrl}/courier-check`, { phone });

      if (response.data.status === 'success') {
        setCourierData(response.data.courierData);
      } else {
        setError('No data found.');
      }
    } catch (err) {
      setError('Error fetching data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {!courierData && !loading && (
        <Button
          type="button"
          onClick={handleFetch}
          size="sm"
          className="h-11 sm:h-9"
        >
          Check Courier
        </Button>
      )}

      {loading && (
        <div className="mt-1" role="status" aria-label="Checking courier">
          <Loader2
            className="size-4 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        </div>
      )}

      {error && (
        <p className="mt-1 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}

      {courierData && (
        <div className="mt-2 grid w-44 grid-cols-2 gap-x-2 gap-y-1 text-xs">
          <p>Total: {courierData.summary.total_parcel}</p>
          <p>Success: {courierData.summary.success_parcel}</p>
          <p>Cancelled: {courierData.summary.cancelled_parcel}</p>
          <p>Ratio: {courierData.summary.success_ratio}%</p>
        </div>
      )}
    </div>
  );
};

export default CourierSummery;
