import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: "",
    name: "",
    email : "",
    schedule: "",
    timezone: "",
    role: "",
    isAuth: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { id, name, schedule, email, timezone, role  } = action.payload;
            state.id = id;
            state.name = name;
            state.schedule = schedule;
            state.timezone = timezone;
            state.email = email;
            state.role = role;
            state.isAuth = true;
        },

        removeUser: (state) => {
            state.id = "";
            state.email = "";
            state.name = "";
            state.schedule = "";
            state.timezone = "";
            state.role = "";
            state.isAuth = false;
        }
    }
})

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;