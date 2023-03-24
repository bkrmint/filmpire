import React, { useState } from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import { useGetActorsDetailsQuery, useGetMoviesByActorIdQuery } from '../services/TMDB';
import useStyles from './styles';
import MovieList from '../MovieList/MovieList';
import Pagination from '../Pagination/Pagination';
// import { MovieList, Pagination } from '..';

const Actors = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const classes = useStyles();

  const { data, isFetching, error } = useGetActorsDetailsQuery(id);

  const { data: movies, isFetching: isFetchingMovies, error: errorMovies } = useGetMoviesByActorIdQuery({ actorId: id, page });

  if (isFetching || isFetchingMovies) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }

  if (error || errorMovies) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          color="primary"
        >
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item lg={5} xl={4}>
          <img
            className={classes.image}
            src={data.profile_path ? `https://image.tmdb.org/t/p/w780${data.profile_path}` : 'https://www.movienewz.com/img/films/poster-holder.jpg'}
            alt={data.name}
          />
        </Grid>
        <Grid item lg={7} xl={8} style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }} />
        <Typography variant="h2" gutterBottom>
          {data?.name}
        </Typography>
        <Typography variant="h5" gutterBottom>
          Born: { new Date(data?.birthday).toLocaleDateString() }
        </Typography>
        <Typography variant="body1" align="justify" paragraph>
          {data?.biography || 'No biography available'}
        </Typography>
        <Box marginTop="2rem" display="flex" justifyContent="space-around">
          <Button
            variant="contained"
            color="primary"
            target="_blank"
            href={`https://www.imdb.com/name/${data?.imdb_id}`}
          >
            IMDB
          </Button>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            color="primary"
          >
            Back
          </Button>
        </Box>
      </Grid>
      <Box margin="2rem 0">
        <Typography variant="h2" align="center" gutterBottom>
          {movies && <MovieList movies={movies} numberOfMovies={12} />}
          <Pagination currentPage={page} setPage={setPage} totalPages={movies?.total_pages} />
        </Typography>
      </Box>
    </>
  );
};

export default Actors;
