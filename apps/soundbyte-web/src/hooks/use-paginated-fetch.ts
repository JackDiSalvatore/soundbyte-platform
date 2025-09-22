import { useCallback, useEffect, useState } from "react";

type Fetcher<T> = (opts?: { next?: boolean }) => Promise<{
  collection: T[];
  next_href?: string;
}>;

export function usePaginatedFetch<T>(fetcher: Fetcher<T>, deps: any[] = []) {
  const [data, setData] = useState<T[]>([]);
  const [nextHref, setNextHref] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPage = useCallback(
    async (opts?: { next?: boolean }) => {
      setIsLoading(true);
      try {
        const res = await fetcher(opts);
        setData((prev) =>
          opts?.next ? [...prev, ...res.collection] : res.collection
        );
        setNextHref(res.next_href);
      } finally {
        setIsLoading(false);
      }
    },
    [fetcher]
  );

  const reset = useCallback(() => {
    setData([]);
    setNextHref(undefined);
  }, []);

  useEffect(() => {
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, nextHref, isLoading, fetchPage, reset };
}
