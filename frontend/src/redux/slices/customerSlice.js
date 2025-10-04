import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    orderId: "",
    customerName: "",
    customerPhone: "",
    guests: 0,
    table: null
}


const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomer: (state, action) => {
      const { name, phone, guests } = action.payload;
      state.orderId = `${Date.now()}`;
      state.customerName = name;
      state.customerPhone = phone;
      state.guests = guests;
    },

    removeCustomer: (state) => {
      state.customerName = "";
      state.customerPhone = "";
      state.guests = 0;
      state.table = null;
      state.orderId = "";
      state.paymentMethod = "";
    },

    updateTable: (state, action) => {
      state.table = action.payload.table;
    },
    updatePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload.paymentMethod;
    },
    setOrderId: (state, action) => {
      state.orderId = action.payload.orderId;
    },
  },
});


export const { setCustomer, removeCustomer, updateTable, setOrderId, updatePaymentMethod } = customerSlice.actions;
export default customerSlice.reducer;