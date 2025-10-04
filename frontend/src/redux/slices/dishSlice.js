import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const dishSlice = createSlice({
    name: "dish",
    initialState,
    reducers: {
        setDish: (state, action) => {
            const { _id, name, price, category, image } = action.payload;
            state._id = _id;
            state.name = name;
            state.price = price;
            state.category = category;
            state.image = image;
        },
        removeDish: (state) => {
            state._id = "";
            state.name = "";
            state.price = "";
            state.category = "";
            state.image = "";
        },
    },
});

export const { setDish } = dishSlice.actions;
export default dishSlice.reducer;