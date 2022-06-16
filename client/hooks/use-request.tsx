import axios from 'axios';
import { useState } from 'react';

interface UseRequest {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'put';
  body: Object;
  onSuccess?: () => void;
}

const useRequest = ({ url, method, body, onSuccess }: UseRequest) => {
  const [errors, setErrors] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const doRequest = async () => {
    setLoading(true);
    try {
      setErrors(null);
      const res = await axios[method](url, body);
      setLoading(false);

      if (onSuccess) {
        onSuccess();
      }

      return res.data;
    } catch (err: any) {
      setLoading(false);
      setErrors(
        <div className="alert alert-danger">
          <h4>Errors...</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err: any, index: number) => (
              <li key={index + 1}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors, loading };
};

export default useRequest;
