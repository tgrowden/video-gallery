/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
export interface Video {
  id: number;

  title: string;

  description: string;

  created_at: string;

  filename: string;
}

export function fetchVideos(): Promise<Video[]> {
  return fetchWithHeaders("/list-videos");
}

export function fetchVideo(id: string | number): Promise<Video> {
  return fetchWithHeaders(`/video/${id}`);
}

export function deleteVideo(id: string | number): Promise<Video> {
  return fetchWithHeaders(`/video/${id}`, "DELETE");
}

// export function postVideoForm

export function fetchWithHeaders(
  url: string,
  method = "GET",
  {
    body,
    headers
  }: { body?: BodyInit | null | undefined; headers?: HeadersInit } = {}
) {
  return fetch(`/api${url}`, {
    method: method,
    body,
    headers: {
      // CSRF prevention
      // https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet#Use_of_Custom_Request_Headers
      "X-Requested-With": "XMLHttpRequest",
      ...headers
    }
  })
    .then((resp) => resp.json())
    .then((result) => {
      if (result.error) {
        return Promise.reject(result.error);
      }
      return Promise.resolve(result);
    })
    .catch((error) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      return Promise.reject(error.toString());
    });
}
