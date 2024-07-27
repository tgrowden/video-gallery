import {
  createFileRoute,
  useLoaderData,
  Link,
  useRouter
} from "@tanstack/react-router";
import { fetchVideo, Video } from "../../utils/Api";
import formatDate from "../../utils/formatDate";
import ConfirmDeleteVideoModal from "../../components/ConfirmDeleteVideoModal";
import { useState } from "react";

export const Route = createFileRoute("/videos/$videoId")({
  loader: async ({ params }) => {
    return fetchVideo(params.videoId);
  },

  component: VideoDetails,

  errorComponent: () => {
    return (
      <div>
        <h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl w-full text-center">
          Not Found
        </h1>

        <p className="text-center text-xl mb-3">
          This video could not be found. It may have been deleted.
        </p>

        <p className="text-center">
          <Link className="text-xl text-blue-500" to="/">
            Go Home
          </Link>
        </p>
      </div>
    );
  }
});

function VideoDetails() {
  const { navigate } = useRouter();

  const [modalOpen, setModalOpen] = useState(false);

  const data: Video = useLoaderData({ from: "/videos/$videoId" });

  return (
    <div className="w-full">
      <p className="mb-2">
        <strong className="font-bold"> Title:</strong> {data.title}
      </p>

      <p className="mb-2">
        <strong className="font-bold"> Description:</strong> {data.description}
      </p>

      <p className="mb-2">
        <strong className="font-bold"> File Name:</strong> {data.filename}
      </p>

      <p className="mb-2">
        <strong className="font-bold"> Created:</strong>{" "}
        {formatDate(data.created_at)}
      </p>

      <video
        className="mx-auto max-w-full rounded-lg aspect-[4/3] mb-4"
        controls
      >
        <source src={`/api/play-video/${data.id}`} />
        Your browser does not support the video tag.
      </video>

      <button
        type="button"
        className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
        onClick={() => setModalOpen(true)}
      >
        Delete Video
      </button>

      <ConfirmDeleteVideoModal
        video={data}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        onDeleted={() => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          navigate({ to: "/videos" });
        }}
      />
    </div>
  );
}
