import { useState } from "react";
import { toast } from "sonner";

const useFetch = (requestFunction) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const runRequest = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await requestFunction(...args);
      setData(result);
      setError(null);
    } catch (error) {
      setError(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn: runRequest, setData };
};

export default useFetch;
