const initialState = {  
  session: {},
  public_key :''
};

export default function (state = initialState, action) {
  switch (action.type) {    
    case 'SET_SESSION':
      return {
        ...state, session: action.session
      }    
    case 'RESET_STATE':
      return {
        ...initialState
      }
    case 'SET_PUBLIC_KEY':
      return{
        ...state, public_key:action.public_key
      }
    case 'RESET_PUBLIC_KEY':
      return{
        ...state, public_key:''        
      }  
    default:
  }
  return state;
}
