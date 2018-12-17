import { cashConstants } from "../constants/actions";
const initialState = {total_amount:(0).toFixed(2),amount:(0).toFixed(2), data:[], sideOption: '0'};

//dummy content
const cashData = (state = initialState, action) => {
  
  switch (action.type) {
    case cashConstants.SUM_AMOUNT:
      return {
        ...state,
        amount: ((state.amount*10)+(action.payload/100)).toFixed(2),
        };
    case cashConstants.SUM_TOTAL:
      return {...state,
        total_amount:(parseFloat(state.total_amount)+parseFloat(state.amount)).toFixed(2), 
        data: [...state.data,{
          id:(state.data.length+1),
          name: "Custom product "+(state.data.length+1),
          quant: 1,
          total: state.amount,
        }] ,
        amount:(0).toFixed(2),};
    case cashConstants.BACK_AMOUNT:
      return {...state,amount: (Math.floor(state.amount*10)/100).toFixed(2) };
    case cashConstants.CLEAR_AMOUNT:
      return {...state,amount: (0).toFixed(2) };
    case cashConstants.CHANGE_OPTION:
      return {...state,sideOption: action.payload };
    default:
        return state
  }
};

export default cashData;
