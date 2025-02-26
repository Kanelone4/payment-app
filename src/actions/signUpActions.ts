export const signUpRequest = () => {
    return { type: 'SIGN_UP_REQUEST' };
  };
  
  export const signUpSuccess = () => {
    return { type: 'SIGN_UP_SUCCESS' };
  };
  
  export const signUpFailure = (error: string) => {
    return { type: 'SIGN_UP_FAILURE', payload: error };
  };