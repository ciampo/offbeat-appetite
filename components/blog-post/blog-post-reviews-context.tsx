import * as React from 'react';

type Action =
  | {
      type: 'FETCH_INIT';
    }
  | {
      type: 'FETCH_SUCCESS';
      payload: {
        reviewCount: number;
        ratingValue: number;
        documentId: null | string;
      };
    }
  | {
      type: 'FETCH_ERROR';
    };
type Dispatch = (action: Action) => void;
type State = {
  isLoading: boolean;
  isError: boolean;
  data: {
    reviewCount: number;
    ratingValue: number;
    documentId: null | string;
  };
};

const PostReviewsStateContext = React.createContext<State | undefined>(undefined);
const PostReviewsDispatchContext = React.createContext<Dispatch | undefined>(undefined);

const postReviewsContext = (state: State, action: Action): State => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isError: false,
        isLoading: true,
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        isError: false,
        isLoading: false,
        data: action.payload || [],
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        isError: true,
        isLoading: false,
      };
  }
};

const PostReviewsProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(postReviewsContext, {
    isLoading: false,
    isError: false,
    data: {
      reviewCount: 0,
      ratingValue: -1,
      documentId: null,
    },
  });

  return (
    <PostReviewsStateContext.Provider value={state}>
      <PostReviewsDispatchContext.Provider value={dispatch}>
        {children}
      </PostReviewsDispatchContext.Provider>
    </PostReviewsStateContext.Provider>
  );
};

function usePostReviewsState(): State {
  const context = React.useContext(PostReviewsStateContext);
  if (context === undefined) {
    throw new Error('usePostReviewsState must be used within a PostReviewsProvider');
  }
  return context;
}
function usePostReviewsDispatch(): Dispatch {
  const context = React.useContext(PostReviewsDispatchContext);
  if (context === undefined) {
    throw new Error('usePostReviewsDispatch must be used within a PostReviewsProvider');
  }
  return context;
}
export { PostReviewsProvider, usePostReviewsState, usePostReviewsDispatch };
