import { createFileRoute, redirect } from "@tanstack/react-router";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const Route = createFileRoute("/")({
  component: () => {
    return <></>;
  },

  loader: () => {
    return redirect({
      to: "/videos"
    });
  }
});
