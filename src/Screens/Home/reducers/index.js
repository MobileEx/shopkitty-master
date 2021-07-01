import * as types from "../actions"

const initialState = {
    error:false
}

export default function homereducer(state=initialState,action){
    switch(action.type){
        case types.REVIEW_SUCCESS:
            return {...state,error:false}
        default:
            return state;
    }
}