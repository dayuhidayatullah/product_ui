import axiosInstance from "../../axios";
import toast from "react-hot-toast";

export const setProducts = (products) => {
  return { type: "SET_PRODUCTS", products: products };
};

export const setLoading = (loading) => {
  return { type: "SET_LOADING", loading: loading };
};

export const setError = (error) => {
  return { type: "SET_ERROR", error: error };
};
export const setProduct = (product) => {
  return { type: "SET_PRODUCT", product: product };
};

export const setIsAddSuccess = (payload) => {
  return { type: "SET_IS_ADD_SUCCESS", isAddSuccess: payload };
};

export const setIsEditSuccess = (payload) => {
  return { type: "SET_IS_EDIT_SUCCESS", isEditSuccess: payload };
};

export const setIsDeleteSuccess = (payload) => {
  return { type: "SET_IS_DELETE_SUCCESS", isDeleteSuccess: payload };
};

export const setIsModalAddOrEditFormOpen = (payload) => {
  return { type: "SET_IS_MODAL_ADD_OR_EDIT_FORM_OPEN", payload };
};
export const setIsModalConfirmationOpen = (payload) => {
  return { type: "SET_IS_MODAL_CONFIRMATION_OPEN", payload };
};
export function fetchProducts(params) {
  return async (dispatch) => {
    try {
      //   const url = "https://localhost:3001/product";
      dispatch(setLoading(true));
      const payload = {
        page: params.page,
        limit: params.limit,
      };
      if (params.sortDir && params.sortBy) {
        payload.sortDir = params.sortDir;
        payload.sortBy = params.sortBy;
      }
      const response = await axiosInstance.get("/product", {
        params: {
          ...payload,
        },
      });
      if (response.data) {
        dispatch(setProducts(response.data));
        dispatch(setLoading(false));
        // }
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      dispatch(setError(err));
      dispatch(setLoading(false));
      console.log(err);
    }
  };
}

export function fetchProduct(id) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get(`/product/${id}`);
      if (response.status === 200) {
        dispatch(setProduct(response.data));
        dispatch(setLoading(false));
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      dispatch(setError(err));
      dispatch(setLoading(false));
    }
  };
}

export function fetchAddProduct(data) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.post("/product", {
        ...data,
      });
      if (response.status === 201) {
        dispatch(setProduct(response.data));
        dispatch(setLoading(false));
        dispatch(setIsModalAddOrEditFormOpen(false));
        dispatch(fetchProducts({ page: 0, limit: 5 }));
        toast.success("Successfully Created!");
      } else {
        dispatch(setLoading(false));
        dispatch(setIsModalAddOrEditFormOpen(false));

        throw new Error(response.error);
      }
    } catch (err) {
      dispatch(setLoading(false));
      dispatch(setIsModalAddOrEditFormOpen(false));
    }
  };
}

export function fetchEditProduct(data) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));

      const response = await axiosInstance.put(`product/${data.id}`, {
        ...data.data,
      });
      if (response.status === 200) {
        dispatch(setLoading(false));
        dispatch(setIsEditSuccess(true));
        dispatch(setIsModalConfirmationOpen(false));
        dispatch(setIsModalAddOrEditFormOpen(false));
        dispatch(fetchProducts({ page: 0, limit: 5 }));

        toast.success("Successfully Edited!");
      } else {
        dispatch(setIsEditSuccess(false));
        dispatch(setLoading(false));
        dispatch(setIsModalConfirmationOpen(false));
        dispatch(setIsModalAddOrEditFormOpen(false));
      }
    } catch (err) {
      dispatch(setLoading(false));
      dispatch(setIsEditSuccess(false));
      dispatch(setIsModalConfirmationOpen(false));
      dispatch(setIsModalAddOrEditFormOpen(false));
    }
  };
}

export function fetchDeleteProduct(id) {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.delete(`/product/${id}`);
      if (response.status === 200) {
        dispatch(setLoading(false));
        dispatch(setIsModalConfirmationOpen(false));
        dispatch(fetchProducts({ page: 0, limit: 5 }));

        toast.success("Successfully Delete!");
      }
    } catch (err) {
      dispatch(setLoading(false));
    }
  };
}
