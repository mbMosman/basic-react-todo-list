const categoryListReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_CATEGORY_LIST':
      return action.payload;
    default:
      return state;
  }
};

export default categoryListReducer;