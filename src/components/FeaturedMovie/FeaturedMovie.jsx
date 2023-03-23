import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';

import useStyles from './styles';

const FeaturedMovie = ({ movie }) => {
  const classes = useStyles();

  if (!movie) return null;

  return (
    <Box component={Link} to={`/movie/${movie.id}`} className={classes.featuredCardContainer}>
      <Card className={classes.card} classes={{ root: classes.cardRoot }}>
        <CardMedia
          media="picture"
          alt={movie.title}
        //   image={`https://image.tmdb.org/t/p/orginal/${movie?.backdrop_path}`}
        //   image={`https://image.tmdb.org/t/p/orginal${movie.poster_path} `}
          image={`https://image.tmdb.org/t/p/w500${movie?.poster_path} `}
          title={movie.title}
          className={classes.cardMedia}
        />
        <Box padding="20px">
          <CardContent className={classes.cardContent} classes={{ root: classes.cardContentRoot }}>
            <Typography variant="h5" gutterBottom>
              {movie.title}
            </Typography>
            <Typography variant="body2">
              {movie.overview}
            </Typography>
          </CardContent>
        </Box>
      </Card>
      {/* <CardContent className={classes.CardContent}>
        <Typography variant="h4" className={classes.title}>
          {movie.title}
        </Typography>
        <Typography variant="h6" className={classes.overview}>
          {movie.overview}
        </Typography>
      </CardContent> */}
    </Box>

  );
};

export default FeaturedMovie;
