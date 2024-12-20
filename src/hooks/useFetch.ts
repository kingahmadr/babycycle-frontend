import { useState, useEffect } from "react";

interface UseFetchResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface UseFetchParams {
  endpoint: string;
  method?: HttpMethod;
  body?: string;
  headers?: Record<string, string>;
  queryParams?: Record<string, string | number | boolean>;
}

const useFetch = <T>({
  endpoint,
  method = "GET",
  body,
  headers,
  queryParams,
}: UseFetchParams): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // setError(null)
      try {
        const queryString = queryParams
          ? "?" +
            new URLSearchParams(
              queryParams as Record<string, string>
            ).toString()
          : "";

        const response = await fetch(endpoint + queryString, {
          method,
          body: body ? JSON.stringify(body) : undefined,
          headers: {
            "Content-Type": "application/json",
            ...(headers || {}),
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, method, body, headers, queryParams]);

  return { data, error, loading };
};

export default useFetch;
