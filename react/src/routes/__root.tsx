import {
  createRootRouteWithContext,
  Link,
  Outlet
} from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: () => (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="font-bold">
          Video Gallery
        </Link>{" "}
      </div>
      <hr />

      <main className="flex flex-col px-4 pt-4">
        <Outlet />
      </main>
    </>
  ),

  notFoundComponent: () => (
    <div>
      <h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-5xl w-full text-center">
        Not Found
      </h1>

      <p className="text-center text-xl mb-3">
        Oops. You may have entered a bad URL.
      </p>

      <p className="text-center">
        <Link className="text-xl text-blue-500" to="/">
          Go Home
        </Link>
      </p>
    </div>
  )
});
