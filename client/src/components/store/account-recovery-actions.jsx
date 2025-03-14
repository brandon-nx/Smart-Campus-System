export const requestOTP = () => {
  return async (dispatch) => {
    const fetchData = async () => {
    //   const res = await fetch("");

    //   if (!res.ok) {
    //     throw new Error("Could not fetch !");
    //   }

    //   const data = await res.json();

    //   return data;
    return {email: "test@test.com", otpStatus: "sent"}
    };

    fetchData();

    // try {
    //   const cartData = await fetchData();
    //   dispatch(
    //     cartActions.replaceCart({
    //       items: cartData.items || [],
    //       totalQuantity: cartData.totalQuantity,
    //     })
    //   );
    // } catch (error) {
    //   dispatch(
    //     uiActions.showNotification({
    //       status: "error",
    //       title: "Error!",
    //       message: "Fetching cart data failed!",
    //     })
    //   );
    // }
  };
};

export const verifyOtp = (inputOtp) => {
  return async (dispatch) => {
    dispatch(
      uiActions.showNotification({
        status: "pending",
        title: "Sending...",
        message: "Sending cart data!",
      })
    );

    const sendRequest = async () => {
      const res = await fetch(
        "https://cart-practice-608ee-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify({
            items: cart.items,
            totalQuantity: cart.totalQuantity,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Sending Cart Data Failed.");
      }
    };

    try {
      await sendRequest();

      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success!",
          message: "Send cart data successfully!",
        })
      );
    } catch (error) {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error!",
          message: "Send cart data failed!",
        })
      );
    }
  };
};
