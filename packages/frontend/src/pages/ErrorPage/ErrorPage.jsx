import { useRouteError } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError();
  return (
    <>
      <h1>404</h1>
      <p>Page not found</p>
    </>
  );
}
