// import actionType from "../actions/actionType";

// const initState = {
//   cartItems: [],
// };

// const cartReducer = (state = initState, action) => {
//   switch (action.type) {
//     case actionType.GET_CURRENT:
//       const { id, quantity } = action.payload;
//       const index = state.items.findIndex((item) => item.product._id === id);
//       if (index !== -1) {
//         state.items[index].quantity = quantity;
//       }
//       return {
//         ...state,
//       };

//     default:
//       return state;
//   }
// };
// export default cartReducer;
