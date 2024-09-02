import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const placeSlice = createSlice({
    name: 'place',
    initialState,
    reducers: {
        addPlaceAction: (state, action) => {
            state.push({
                id: action.payload.id,
                pname: action.payload.pname,
                avgRates: action.payload.avgRates,
                address1: action.payload.address1,
                address2: action.payload.address2,
                address3: action.payload.address3,
                tel: action.payload.tel,
                reviewCount: action.payload.reviewCount,
                categories: action.payload.categories,
                operationhours: action.payload.operationhours,
                breakhours: action.payload.breakhours,
                latitude: action.payload.latitude,
                longitude: action.payload.longitude,
            });
        },
        setPlacesAction: (state, action) => {
            return action.payload.map(place => ({
                id: place.id,
                pname: place.pname,
                avgRates: place.avgRates,
                address1: place.address1,
                address2: place.address2,
                address3: place.address3,
                tel: place.tel,
                reviewCount: place.reviewCount,
                categories: place.categories,
                operationhours: place.operationhours,
                breakhours: place.breakhours,
                latitude: place.latitude,
                longitude: place.longitude,
            }));
        },
        clearPlacesAction: (state) => {
            return initialState;
        }
    },
});

export const { addPlaceAction, setPlacesAction, clearPlacesAction } = placeSlice.actions;
export default placeSlice.reducer;