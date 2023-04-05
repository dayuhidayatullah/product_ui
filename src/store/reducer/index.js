const initialState = {
  products: [],
  loading: false,
  productCount: 10,
  error: null,
  product: {},
  offset: 0,
  limit: 5,
  isAddSuccess: false,
  isEditSuccess: false,
  isDeleteSuccess: false,
  isModalAddOrEditFormOpen: false,
  isModalConfirmation: false,
};

const ProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.products.rows,
        productCount: action.products.count,
      };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_PRODUCT":
      return {
        ...state,
        product: action.product,
      };
    case "SET_IS_ADD_PRODUCT":
      return {
        ...state,
        isAddSuccess: action.payload,
      };
    case "SET_IS_EDIT_PRODUCT":
      return {
        ...state,
        isEditSuccess: action.payload,
      };
    case "SET_IS_DELETE_PRODUCT":
      return {
        ...state,
        isDeleteSuccess: action.payload,
      };
    case "SET_IS_MODAL_ADD_OR_EDIT_FORM_OPEN":
      return {
        ...state,
        isModalAddOrEditFormOpen: action.payload,
      };
    case "SET_IS_MODAL_CONFIRMATION_OPEN":
      return {
        ...state,
        isModalConfirmation: action.payload,
      };
    default:
      return state;
  }
};

export default ProductReducer;
