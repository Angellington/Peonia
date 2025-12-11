import { useQuery } from "@tanstack/react-query";
import postFetch from "../api/postFetch";

export default function usePostSearch(pageNumber) {
  return useQuery({
    queryKey: ["posts", pageNumber],
    queryFn: () =>
      postFetch.get("", {
        params: { page: pageNumber, limit: 10 }
      }).then(res => res.data),
    keepPreviousData: true
  });
}
