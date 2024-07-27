import { createFileRoute } from "@tanstack/react-router";

import Videos from "../../components/Videos";

export const Route = createFileRoute("/videos/")({
  pendingComponent: () => <>Loading...</>,

  component: () => (
    <div className="mb-8">
      <Videos />
    </div>
  )
});
