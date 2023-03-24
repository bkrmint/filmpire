import React, { useState, useEffect } from 'react';

import { Modal, Typography, Button, ButtonGroup, Grid, Box, CircularProgress, Rating } from '@mui/material';
import { Movie as MovieIcon, Theaters, Language, PlusOne, Remove, ArrowBack, Favorite, FavoriteBorderOutlined } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { selectGenreOrCategory } from '../features/currentGenreOrCategory';

import { useGetListQuery, useGetMovieQuery, useGetRecommendationsQuery } from '../services/TMDB';
import { userSelector } from '../features/auth';

// import { MovieList } from '..';
import MovieList from '../MovieList/MovieList';

import useStyles from './styles';
import genreIcons from '../../assets/genres';

const MovieInformation = () => {
  const { user } = useSelector(userSelector);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const { data, isFetching, error } = useGetMovieQuery(id);

  const { data: favoriteMovies } = useGetListQuery({ accountId: user.id, listName: 'favorite/movies', sessionId: localStorage.getItem('session_id'), page: 1 });
  const { data: watchlistMovies } = useGetListQuery({ accountId: user.id, listName: 'watchlist/movies', sessionId: localStorage.getItem('session_id'), page: 1 });

  const { data: recommendations, isFetching: isRecommendationsFetching } = useGetRecommendationsQuery({ movie_id: id, list: 'recommendations' });

  console.log('recommendations', recommendations);

  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);

  // !{} -> object is truthy so make it into falsy by adding !
  // !!{} -> by adding another ! you make it into true
  // So if a match is found  !!{} will return true - isFavorite = true
  // Think like complex if statement Either true or false path.
  useEffect(() => {
    setIsMovieFavorited(!!favoriteMovies?.results?.find((movie) => movie.id === data?.id));
  }, [favoriteMovies, data]);

  useEffect(() => {
    setIsMovieWatchlisted(!!watchlistMovies?.results?.find((movie) => movie.id === data?.id));
  }, [watchlistMovies, data]);

  const addToFavorites = async () => {
    await axios.post(`https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${process.env.REACT_APP_TMDB_KEY}&session_id=${localStorage.getItem('session_id')} `, {
      media_type: 'movie',
      media_id: id,
      favorite: !isMovieFavorited,
    });
    setIsMovieFavorited((prev) => !prev);
  };

  // https://api.themoviedb.org/3/account/18355150/watchlist?api_key=00ccb25abd1b45cc6fb98941dc19e88b&session_id=7b7ce4abad0bc94f3f02153e419b28a325cc3efc

  const addToWatchlist = async () => {
    await axios.post(`https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${process.env.REACT_APP_TMDB_KEY}&session_id=${localStorage.getItem('session_id')} `, {
      media_type: 'movie',
      media_id: id,
      watchlist: !isMovieWatchlisted,
    });
    setIsMovieWatchlisted((prev) => !prev);
  };

  if (isFetching || isRecommendationsFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size="8rem" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Link to="/"> Somthing has broken. Go back </Link>
      </Box>
    );
  }

  return (
    <Grid container className={classes.containerSpaceAround}>
      <Grid item sm={12} lg={4} style={{ display: 'flex', marginBottom: '30px' }}>
        <img
          className={classes.poster}
          src={`https://image.tmdb.org/t/p/w500${data.poster_path}`}
          alt={data?.title}
        />
      </Grid>
      <Grid item containter direction="column" lg={7}>
        <Typography variant="h3" align="center" gutterBottom>
          {data?.title} ({data?.release_date?.slice(0, 4)})
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          {data?.tagline}
        </Typography>
        <Grid item className={classes.containerSpaceAround}>
          <Box display="flex" align="center">
            <Rating readOnly value={data?.vote_average / 2} />
            <Typography variant="subtitle1" align="center" gutterBottom style={{ marginLeft: '10px' }}>
              {data?.vote_average} / 10
            </Typography>
          </Box>
          <Typography variant="h6" align="center" gutterBottom>
            {data?.runtime} min | Language: {data?.spoken_languages[0]?.name}
          </Typography>
        </Grid>
        <Grid item className={classes.genresContainer}>
          {/* removing i in map */}
          {data?.genres.map((genre) => (
            <Link key={genre.name} className={classes.links} to="/" onClick={() => dispatch(selectGenreOrCategory(genre.id))}>
              <img src={genreIcons[genre.name.toLowerCase()]} className={classes.genreImage} height={30} />
              <Typography variant="subtitle1" align="center" gutterBottom>
                {genre?.name}
              </Typography>
            </Link>
          ))}
        </Grid>
        <Typography variant="h5" align="center" gutterBottom style={{ marginTop: '10px' }}>
          Overview
        </Typography>
        <Typography style={{ marginBottom: '2rem' }}>
          {data?.overview}
        </Typography>
        <Typography variant="h5" align="center" gutterBottom>
          <Grid item container spacing={2}>
            {/* removing i in map */}
            {data && data.credits?.cast?.map((cast) => (
              cast.profile_path && (
                <Grid item key={cast.id} xs={4} sm={4} md={3} lg={2} component={Link} to={`/actors/${cast.id}`} style={{ textDecoration: 'none' }}>
                  <img className={classes.castImage} src={`https://image.tmdb.org/t/p/w500${cast.profile_path}`} alt={cast.name} />
                  <Typography color="textPrimary">
                    {cast?.name}
                  </Typography>
                  <Typography color="textSecondary">
                    {cast?.character.split('/')[0] }
                  </Typography>

                </Grid>
              )
            )).slice(0, 6)}

          </Grid>
        </Typography>

        <Grid item container style={{ marginTop: '2rem' }}>
          <div className={classes.buttonsContainer}>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup variant="outlined">
                <Button
                  target="_blank"
                  rel="noopener noreferrer"
                  href={data?.homepage}
                  endIcon={<Language />}
                >
                  Webstite
                </Button>
                <Button
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.imdb.com/title/${data?.imdb_id}`}
                  endIcon={<MovieIcon />}
                >
                  IMDB
                </Button>
                <Button
                  onClick={() => setOpen(true)}
                  href="#"
                  endIcon={<Theaters />}
                >
                  Trailer
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup variant="outlined" size="medium">
                <Button
                  onClick={addToFavorites}
                  endIcon={isMovieFavorited ? <FavoriteBorderOutlined /> : <Favorite />}
                >
                  {isMovieFavorited ? 'Remove from favorites' : 'Add to favorites'}
                </Button>
                <Button
                  onClick={addToWatchlist}
                  endIcon={isMovieWatchlisted ? <Remove /> : <PlusOne />}
                >
                  {isMovieWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </Button>
                <Button
                  endIcon={<ArrowBack />}
                  sx={{ borderColor: 'primary.main' }}
                >
                  <Typography
                    component={Link}
                    to="/"
                    color="inherit"
                    variant="subtitle2"
                    style={{ textDecoration: 'none' }}
                  >
                    Back
                  </Typography>

                </Button>
              </ButtonGroup>
            </Grid>

          </div>
        </Grid>

      </Grid>
      <Box marginTop="5rem" width="100">
        <Typography variant="h3" align="center" gutterBottom>
          You might also like
        </Typography>
        {recommendations
          ? <MovieList movies={recommendations} numberOfMovies="8" />
          : <Box> Sorry, Noting was found. </Box>}
      </Box>
      <Modal
        closeAfterTransition
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
      >
        {data?.videos?.results?.length > 0 && (
        <iframe
          autoPlay
          className={classes.video}
          frameBorder="0"
          title="Trailer"
          src={`https://youtube.com/embed/${data.videos.results[0].key}`}
          allow="autoplay"
        />
        )}
      </Modal>
    </Grid>
  );
};

export default MovieInformation;
