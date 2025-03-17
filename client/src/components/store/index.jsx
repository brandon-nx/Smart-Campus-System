import { configureStore } from "@reduxjs/toolkit";
import accountRecoverySlice from "./account-recovery-slice";
import authSlice from "./auth-slice";


const store = configureStore({
    reducer: {
        accountRecovery: accountRecoverySlice.reducer,
        auth: authSlice.reducer
    }
});

export default store;