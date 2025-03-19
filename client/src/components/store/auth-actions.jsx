import { authActions } from "./auth-slice";

export const verifyToken = () => {
  return async (dispatch) => {
    try {
      let res = await fetch("http://localhost:8080/verify-token", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (res.status === 402 || res.status === 403) {
        console.log("Token is not valid / expired!");

        //Check refresh token available
        res = await fetch("http://localhost:8080/token", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (res.status === 402 || res.status === 401) {
          console.log("Refresh token not found!");
          localStorage.removeItem("accessToken");
          dispatch(authActions.logout());
          return;
        }

        if (!res.ok) {
          throw new Response(
            { message: "Error verifying refresh token!" },
            { status: 500 }
          );
        }

        //If refresh token found!
        const refreshData = await res.json();

        console.log("Refresh token found!");

        localStorage.setItem("accessToken", refreshData.token);
        dispatch(authActions.login(refreshData));
        return;
      }

      if (!res.ok) {
        throw new Response(
          { message: "Error verifying token!" },
          { status: 500 }
        );
      }

      //If token is valid
      const data = await res.json();

      console.log("Token is valid!");
      dispatch(authActions.login(data.user));
    } catch (err) {
      console.error("Error verifying token:", err);
    }
  };
};

export const removeToken = () => {
  return async (dispatch) => {
    try {
      let res = await fetch("http://localhost:8080/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Response(
          { message: "Error removing refresh token!" },
          { status: 500 }
        );
      }

      //If token is valid
      await res.json();
      console.log("Logout worked!");
      localStorage.removeItem("accessToken");
      dispatch(authActions.logout());
    } catch (err) {
      console.error("Error removing refresh token:", err);
    }
  };
};
