import { configureStore } from "@reduxjs/toolkit";
import accountRecoverySlice from "./account-recovery-slice";


const store = configureStore({
    reducer: {
        accountRecovery: accountRecoverySlice.reducer,
    }
});

export default store;