import { createFileRoute } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";

import VideoForm from "../../components/VideoForm";

export const Route = createFileRoute("/videos/upload")({
  component: () => <UploadPage />
});

function UploadPage() {
  const { navigate } = useRouter();

  return (
    <div>
      <h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl w-full text-center">
        Upload New Video
      </h1>

      <VideoForm onSuccess={() => navigate({ to: "/videos" })} />
    </div>
  );
}
