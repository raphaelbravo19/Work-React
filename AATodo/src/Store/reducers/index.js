import Axios from 'axios'
const types = {
  MAKE_CHECK:'MAKE_CHECK',
  ADD_ITEM:'ADD_ITEM',
  REMOVE_ITEM:'REMOVE_ITEM',
  REMOVE_ALL:'REMOVE_ALL',
  GET_ALL:'GET_ALL',
}
const FirebaseDB = `https://projectsix-94eec.firebaseio.com`;
export const actionCreators = {
  get: ()=>{
    return {type: types.GET_ALL}
  },
  check:(index)=>{
    return {type: types.MAKE_CHECK,payload:index}
  },
  add:(item)=>{
    return {type: types.ADD_ITEM,payload:item}
  },
  remove:(index)=>{
    return {type: types.REMOVE_ITEM,payload:index}
  },
  removeAll:()=>{
    return {type: types.REMOVE_ALL}
  }
}

const initialState = {
  data: [
    {title:'Dormir',completed:false},
    {title:'Trabajar',completed:true}],
}

export const reducer = (state = initialState, action) => {
  const {type, payload} = action
  const {data} = state
  switch(type) {
    case types.GET_ALL:{
      var tasks =[]
      Axios(`https://projectsix-94eec.firebaseio.com/tasks.json`)
      .then(response => {
          for(let key in response.data){
            tasks.push({
                  ...response.data[key]
              })
          }
          console.log(response.data)  
    })
    var newState =  ({...state,data:tasks})
    return newState;
      
      
    }
    
    case types.MAKE_CHECK:{
      return {
        ...state,
        data: data.map((item,i)=>{
          if(i==payload){
              return {title: item.title, completed: !item.completed}
          }
          return item;
        })
      }
    }
    case types.ADD_ITEM:{
      fetch(`${FirebaseDB}/tasks.json`,{
        method: 'POST',
        body: JSON.stringify(payload), // data can be `string` or {object}!
        headers:{
        'Content-Type': 'application/json'
        }
      }).then(response => {
        
      })
      return {
        ...state,
        data: [payload,...data]
      }
    }
    case types.REMOVE_ITEM:{
      return {
        ...state,
        data: data.filter((item,i) => i !== payload)
      }
    }
    case types.REMOVE_ALL:{
      return {
        ...state,
        data: data.filter((item,i) => item.completed !== true)
      }
    }
    default: {
      return state
    }
  }
}
