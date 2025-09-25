import { useCallback, useEffect, useState } from "react";

type Fetcher<T> = (opts?: { next?: boolean; nextHref?: string }) => Promise<{
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
        const res = await fetcher({
          ...opts,
          nextHref: opts?.next ? nextHref : undefined,
        });
        setData((prev) =>
          opts?.next ? [...prev, ...res.collection] : res.collection
        );
        setNextHref(res.next_href);
      } finally {
        setIsLoading(false);
      }
    },
    [nextHref]
  );

  const reset = useCallback(() => {
    setData([]);
    setNextHref(undefined);
    fetchPage();
  }, []);

  useEffect(() => {
    reset();
  }, deps);

  return { data, nextHref, isLoading, fetchPage, reset };
}
