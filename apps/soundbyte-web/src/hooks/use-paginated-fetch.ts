import { SoundCloudPaginatedResponse } from "@/types/soundcloud-paginated-response";
import { useEffect, useState } from "react";

export function usePaginatedFetch<T>(
  fetchFn: (options?: {
    next?: boolean;
  }) => Promise<SoundCloudPaginatedResponse<T[]>>,
  deps: any[] = [] // add deps here
) {
  const [data, setData] = useState<T[]>([]);
  const [nextHref, setNextHref] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchPage = async (options?: { next?: boolean }) => {
    setIsLoading(true);
    try {
      const res = await fetchFn({ next: options?.next });
      setData((prev) =>
        options?.next ? [...prev, ...res.collection] : res.collection
      );
      setNextHref(res.next_href);
    } catch (err) {
      console.error("Paginated fetch failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, nextHref, isLoading, fetchPage };
}
