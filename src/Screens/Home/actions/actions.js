import * as types from './index'

export const profilerequest = (token,id) => {
    return{
        type:types.REVIEW_SUCCESS,
        payload:{token,id}
    }
}