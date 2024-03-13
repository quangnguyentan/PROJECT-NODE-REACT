import actionType from "./actionType";
export const updateQuantityAction = (productId, quantities) => {
  return {
    type: actionType.UPDATE_QUANTITY,
    dispatch: {
      productId,
      quantities,
    },
  };
};
