import { Link } from "@tanstack/react-router";

import { Video } from "../utils/Api";
import formatDate from "../utils/formatDate";

export default function VideoCard({ video }: { video: Video }) {
  return (
    <Link
      to={`/videos/${video.id}`}
      className="max-w rounded overflow-hidden shadow-lg hover:bg-slate-200 transition-all"
    >
      {/* <img className="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains"> */}
      <div className="px-6 py-4">
        <span
          className="font-bold text-xl mb-2 overflow-hidden overflow-ellipsis max-w-full w-auto text-nowrap"
          title={video.title}
        >
          {video.title}
        </span>
        <p
          className="text-gray-700 text-base overflow-hidden overflow-ellipsis max-w-full w-auto text-nowrap"
          title={video.description}
        >
          {video.description}
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span
          className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          data-value={video.created_at}
        >
          Created {formatDate(video.created_at)}
        </span>
      </div>
    </Link>
  );
}
