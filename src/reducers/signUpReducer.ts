import { Action } from 'redux';

interface SignUpAction extends Action {
  payload?: string;
}

interface SignUpState {
  loading: boolean;
  error: string | null;
}

const initialState: SignUpState = {
  loading: false,
  error: null,
};

const signUpReducer = (state = initialState, action: SignUpAction): SignUpState => {
    switch (action.type) {
      case 'SIGN_UP_REQUEST':
        return { ...state, loading: true };
      case 'SIGN_UP_SUCCESS':
        return { ...state, loading: false, error: null };
      case 'SIGN_UP_FAILURE':
        return { ...state, loading: false, error: action.payload ?? null };
      default:
        return state;
    }
  };

export default signUpReducer;