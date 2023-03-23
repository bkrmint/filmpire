import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, useMediaQuery, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import { useGetMoviesQuery } from '../services/TMDB';
import { Movie, MovieList, Pagination, FeaturedMovie } from '..';

const Movies = () => {
  const [page, setPage] = useState(1);
  const { genreIdOrCategoryName, searchQuery } = useSelector((state) => state.currentGenreOrCategory);
  const lg = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const numberOfMovies = lg ? 19 : 19;

  // console.log(' In movies genreIdOrCategoryName: ', genreIdOrCategoryName);

  const { data, error, isFetching } = useGetMoviesQuery({ genreIdOrCategoryName, page, searchQuery });

  if (isFetching) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size="4rem" />
      </Box>
    );
  }

  if (!data.results.length) {
    return (
      <Box display="flex" alignItems="center" mt="20px">
        <Typography variant="h4" color="textSecondary">
          No movies found <br /> Please search for something else
        </Typography>
      </Box>
    );
  }

  if (error) {
    return <div>Something went wrong</div>;
  }

  // console.log(' data: ', data);

  return (
    <div>
      <FeaturedMovie movie={data.results[0]} />
      <MovieList movies={data} numberOfMovies={numberOfMovies} excludeFirst />
      <Pagination currentPage={page} setPage={setPage} totalPages={data.total_pages} />
    </div>
  );
};

export default Movies;
