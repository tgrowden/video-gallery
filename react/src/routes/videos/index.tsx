import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { Video, fetchVideos } from "../../utils/Api";
import Videos from "../../components/Videos";

export const Route = createFileRoute("/videos/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.fetchQuery({
      queryKey: ["videos"],
      queryFn: fetchVideos
    }),

  pendingComponent: () => <>Loading...</>,

  component: () => <VideosRoute />
});

function VideosRoute() {
  const videos: Video[] = useLoaderData({ from: "/videos/" });

  return <Videos videos={videos} />;
}
