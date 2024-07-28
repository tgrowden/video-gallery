import { Link } from "@tanstack/react-router";
import { Video } from "../utils/Api";
import VideoCard from "./VideoCard";

interface VideosProps {
  videos: Video[];
}
export default function Videos({ videos }: VideosProps) {
  return (
    <>
      <div>
        <h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl w-full text-center">
          Videos
        </h1>
        <div>
          <>
            {videos.length ? (
              <div className="w-full self-center grid gap-4 grid-cols-3 lg:grid-cols-4">
                <>
                  {videos.map((i) => (
                    <VideoCard video={i} key={i.id} />
                  ))}
                </>
              </div>
            ) : (
              <p className="text-center text-slate-900">
                You don't have any videos yet. Try{" "}
                <Link className="underline text-blue-500" to="/videos/upload">
                  uploading one
                </Link>
                .
              </p>
            )}

            <div className="fixed bottom-4 right-4">
              <Link
                to="/videos/upload"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all"
              >
                + Add Video
              </Link>
            </div>
          </>
        </div>
      </div>
    </>
  );
}
