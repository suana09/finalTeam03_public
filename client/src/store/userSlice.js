import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    email:'',
    nickname:'',
    provider:'',
    pwd:'',
}

const userSlice = createSlice(
    {
        name : 'user' ,
        initialState ,
        reducers:{
            loginAction:(state, action)=>{
                state.email = action.payload.email;
                state.nickname = action.payload.nickname;
                state.provider = action.payload.provider;

            },
            logoutAction:(state)=>{
                state.email='';
                state.nickname='';
                state.provider='';
            },

        }
    }
);

export const { loginAction, logoutAction, updateUserAction  } = userSlice.actions;
export default userSlice.reducer;