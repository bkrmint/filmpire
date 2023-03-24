import React from 'react';
import { Typography, Box } from '@mui/material';
import useStyles from './styles';

import Movie from '../Movie/Movie';

const RatedCards = ({ title, data }) => {
  // console.log('RatedCards');
  // console.log('data', data);
  const classes = useStyles();
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom> {title} </Typography>
      <Box display="flex" flexWrap="wrap" className={classes.container}>
        {data?.results?.map((movie, i) => (
          <Movie key={movie.id} movie={movie} i={i} /> // i we are passing to grow out animation
        ))}
      </Box>
    </Box>
  );
};

export default RatedCards;
