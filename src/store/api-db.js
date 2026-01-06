import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from './firebase-service'

const initialState = {
    loggedInUser: null,
    any: {},
    //data: { items: [], recordPerPage: 0 },// 0:all
}

// Calling api => get 'user/id' , return single object
export const getSingleData = createAsyncThunk("data/getSingleData", async (action, store) => {
    if (!action) {
        return null;
    }

    return await api.getSingleData(action);
})

// Calling api => get 'user' , return collection object : {items:[],totalRecords}
export const getData = createAsyncThunk("data/getData", async (action, store) => {
    if (!action) {
        return null;
    }

    const availableOption = store.getState().api[action.module]?.options;
    action.options = { currentPage: 1, ...availableOption, ...action.options };
    return await api.getData(action);
})

// Calling api => post 'user' , returns id
export const addData = createAsyncThunk("data/addData", async (action, store) => {
    // Each module must have the following field along with others
    // id - auto
    // name - from calling function - mandatory
    // status - new
    // schema - module
    // user
    // dateCreated  - utc now
    // application - global

    if (!action) {
        return null;
    }

    return api.addData(action);
})

// Calling api => put 'user' , returns id
export const editData = createAsyncThunk("data/editData", async (action, store) => {
    if (!action) {
        return null;
    }

    return await api.editData(action);
})

// Calling api => delete 'user' , returns id
export const deleteData = createAsyncThunk("data/deleteData", async (action, store) => {
    if (!action) {
        return null;
    }

    return await api.deleteData(action);
})

export const loginUser = createAsyncThunk("user/loginUser", async (action, store) => {
    if (!action) {
        return null;
    }

    return await api.loginUser(action);
})

export const changePassword = createAsyncThunk("identity/changePassword", async (action, store) => {
    if (!action) {
        return null;
    }

    return await api.changePassword(action);
})

export const resetPassword = createAsyncThunk("identity/resetPassword", async (action, store) => {
    if (!action) {
        return null;
    }

    return await api.resetPassword(action);
})

export const updateProfile = createAsyncThunk("identity/updateProfile", async (action, store) => {
    if (!action) {
        return null;
    }

    return await api.updateProfile(action);
})

export const registerUser = createAsyncThunk("user/registerUser", async (action, store) => {
    if (!action) {
        return null;
    }
    return await api.registerUser(action);
})

export const forgotPassword = createAsyncThunk("identity/forgotPassword", async (action, store) => {
    if (!action) {
        return null;
    }

    return await api.forgotPassword(action);
})

export const apiSlice = createSlice({
    name: 'ilab-api',
    initialState,
    reducers: {
        setModuleDataItem: (state, action) => {
            state[action?.payload?.module] = { items: action?.payload?.data }
        },
        resetSave: (state, action) => {
            state[action?.payload?.module] = { ...state[action?.payload?.module], saved: "" }
            state["any"].saved = { ...state["any"], saved: "" }
        },
        selectModuleItem: (state, action) => {
            state[action?.payload?.module] = { ...state[action?.payload?.module], selectedId: action.payload.id }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getSingleData.pending, (state, action) => {
                state[action.meta.arg.module] = { ...state[action.meta.arg.module], status: "loading" }
                state["any"].status = "loading"
            })
            .addCase(getSingleData.fulfilled, (state, action) => {
                state[action.meta.arg.module].status = "succeeded"
                state["any"].status = "succeeded"

                const items = state[action.meta.arg.module].items;
                if (items) {
                    const index = items?.findIndex(item => `${item.id}` === action.meta.arg.id)
                    state[action.meta.arg.module].items = [
                        ...items?.slice(0, index), // everything before array
                        {
                            ...items[index],
                            ...action.payload.data
                        },
                        ...items?.slice(index + 1), // everything after array
                    ]
                }
            })
            .addCase(getSingleData.rejected, (state, action) => {
                state[action.meta.arg.module] = { ...state[action.meta.arg.module] }
                state[action.meta.arg.module].status = "error"
                state[action.meta.arg.module].message = action.error.message

                state["any"].status = "error"
                state["any"].message = state[action.meta.arg.module].message
            })
            .addCase(getData.pending, (state, action) => {
                state[action.meta.arg.module] = { ...state[action.meta.arg.module], status: "loading" }
                state["any"].status = "loading"
            })
            .addCase(getData.fulfilled, (state, action) => {
                state[action.meta.arg.module].status = "succeeded"
                state["any"].status = "succeeded"
                action.payload.data.totalPages = action.meta.arg.options.recordPerPage === 0 ? 1
                    : parseInt(action.payload.data.totalRecords / action.meta.arg.options.recordPerPage)
                    + (action.payload.data.totalRecords % action.meta.arg.options.recordPerPage !== 0 ? 1 : 0);
                state[action.meta.arg.module] = { ...action.payload.data, ...{ options: action.meta.arg.options } };
            })
            .addCase(getData.rejected, (state, action) => {
                state[action.meta.arg.module] = { ...state[action.meta.arg.module] }
                state[action.meta.arg.module].status = "error"
                state[action.meta.arg.module].message = action.error.message

                state["any"].status = "error"
                state["any"].message = action.error.message
            })
            .addCase(addData.pending, (state, action) => {
                state[action.meta.arg.module] = { ...state[action.meta.arg.module], status: "loading" }
                state["any"].status = "loading"
            })
            .addCase(addData.fulfilled, (state, action) => {
                if (!action?.payload.data) {
                    state[action.meta.arg.module] = { ...state[action.meta.arg.module] }
                    state[action.meta.arg.module].status = "error"
                    state[action.meta.arg.module].message = "Error in saving..."

                    state["any"].status = "error"
                    state["any"].message = "Error in saving..."
                    return
                }
                state[action.meta.arg.module].saved = "saved"
                state[action.meta.arg.module].selectedItemId = action?.payload.data

                state["any"].saved = "saved"
            })
            .addCase(addData.rejected, (state, action) => {
                state[action.meta.arg.module] = { ...state[action.meta.arg.module] }
                state[action.meta.arg.module].status = "error";
                state[action.meta.arg.module].message = action.error.message;

                state["any"].status = "error"
                state["any"].message = action.error.message
            })
            .addCase(editData.pending, (state, action) => {
                state[action.meta.arg.module] = { ...state[action.meta.arg.module], status: "loading" }
                state["any"].status = "loading"
            })
            .addCase(editData.fulfilled, (state, action) => {
                if (!action?.payload.data) {
                    state[action.meta.arg.module] = { ...state[action.meta.arg.module] }
                    state[action.meta.arg.module].status = "error"
                    state.message = "Error in saving..."

                    state["any"].status = "error"
                    state["any"].message = "Save error.."
                    return
                }
                state[action.meta.arg.module].saved = "saved"
                state[action.meta.arg.module].selectedItemId = action?.payload.data

                state["any"].saved = "saved"
            })
            .addCase(editData.rejected, (state, action) => {
                state[action.meta.arg.module] = { ...state[action.meta.arg.module] }
                state[action.meta.arg.module].status = "error"
                state[action.meta.arg.module].message = action.error.message

                state["any"].status = "error"
                state["any"].message = action.error.message
            })
            .addCase(deleteData.pending, (state, action) => {
                state[action.meta.arg.module] = { ...state[action.meta.arg.module], status: "loading" }
                state["any"].status = "loading"
            })
            .addCase(deleteData.fulfilled, (state, action) => {
                if (!action?.payload.data) {
                    state[action.meta.arg.module] = { ...state[action.meta.arg.module] }
                    state[action.meta.arg.module].status = "error"
                    state[action.meta.arg.module].message = "Error in deleting..."

                    state["any"].status = "error"
                    state["any"].message = "Error in deleting..."
                    return
                }
                state[action.meta.arg.module].saved = "saved"
                state["any"].saved = "saved"
            })
            .addCase(deleteData.rejected, (state, action) => {
                state[action.meta.arg.module] = { ...state[action.meta.arg.module] }
                state[action.meta.arg.module].status = "error"
                state.message = action.error.message

                state["any"].status = "error"
                state["any"].message = action.error.message
            })
            .addCase(loginUser.pending, (state, action) => {
                state["any"].status = "loading"
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state["any"].status = "succeeded"

                const resetPassword = action?.meta?.arg?.data?.password === 'Admin@123'
                state.loggedInUser = { ...action?.payload, resetPassword: resetPassword };
            })
            .addCase(loginUser.rejected, (state, action) => {
                state["any"].status = "error"
                state["any"].message = action.error.message
                state.loggedInUser = {}
            })
            .addCase(changePassword.pending, (state, action) => {
                state["any"].status = "loading"
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state[action.meta.arg.module] = { ...state[action.meta.arg.module] }
                state["any"].status = "succeeded"
                state[action.meta.arg.module].saved = "saved"
            })
            .addCase(changePassword.rejected, (state, action) => {
                state["any"].status = "error"
                state["any"].message = action.error.message
            })
            .addCase(resetPassword.pending, (state, action) => {
                state["any"].status = "loading"
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state[action.meta.arg.module] = { ...state[action.meta.arg.module] }
                state["any"].status = "succeeded"
                state[action.meta.arg.module].saved = "saved"
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state["any"].status = "error"
                state["any"].message = action.error.message
            })
            .addCase(updateProfile.pending, (state, action) => {
                state["any"].status = "loading"
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state[action.meta.arg.module] = { ...state[action.meta.arg.module] }
                state["any"].status = "succeeded"
                state[action.meta.arg.module].saved = "saved"
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state["any"].status = "error"
                state["any"].message = action.error.message
            })
            .addCase(registerUser.pending, (state, action) => {
                state["any"].status = "loading"
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state["any"].saved = "saved"
            })
            .addCase(registerUser.rejected, (state, action) => {
                state["any"].status = "error"
                state["any"].message = action.error.message
            })
            .addCase(forgotPassword.pending, (state, action) => {
                state["any"].status = "loading"
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state["any"].status = "succeeded"
                state["identity"] = { ...state["identity"], saved: "saved" }
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state["any"].status = "error"
                state["any"].message = action.error.message
            })
    }
})



// Action creators are generated for each case reducer function
export const { setModuleDataItem, resetSave, selectModuleItem } = apiSlice.actions

export default apiSlice.reducer