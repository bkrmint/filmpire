import { configureStore } from '@reduxjs/toolkit';

import { TMDBApi } from '../components/services/TMDB';
import genreOrCategoryReducer from '../components/features/currentGenreOrCategory';
import userReducer from '../components/features/auth';

export default configureStore({
  reducer: {
    [TMDBApi.reducerPath]: TMDBApi.reducer,
    currentGenreOrCategory: genreOrCategoryReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(TMDBApi.middleware),
});
