// ErrorBoundary.jsx
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

const styles = {
  container: {
    minHeight: "60vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "1rem",
    color: "#374151",
  },
  code: {
    fontSize: "4rem",
    margin: 0,
    color: "#ef4444",
  },
  message: {
    fontSize: "1.25rem",
    margin: "0.5rem 0 1.5rem",
  },
  link: {
    fontSize: "1rem",
    color: "#3b82f6",
    textDecoration: "none",
  },
};

export default function ErrorBoundary() {
  const error = useRouteError();

  let message;
  if (isRouteErrorResponse(error)) {
    message = error.statusText || "Unknown response error";
  } else if (error instanceof Error) {
    message = error.message;
  } else {
    message = "Something went wrong.";
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.code}>
        {isRouteErrorResponse(error) ? error.status : "Oops"}
      </h1>
      <p style={styles.message}>{message}</p>
      <Link to="/" style={styles.link}>
        Go back home
      </Link>
    </div>
  );
}
