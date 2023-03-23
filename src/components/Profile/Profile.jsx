import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Button, Box } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { userSelector } from '../features/auth';
import { useGetListQuery } from '../services/TMDB';
import RatedCards from '../RatedCards/RatedCards';

const Profile = () => {
  const { user } = useSelector(userSelector);
  // const favoriteMovies = user.favoriteMovies || [];

  console.log('user in profile ', user);

  const { data: favoriteMovies, refetch: refetchFavorites } = useGetListQuery({ accountId: user.id, listName: 'favorite/movies', sessionId: localStorage.getItem('session_id'), page: 1 });
  const { data: watchlistMovies, refetch: refetchWatchlisted } = useGetListQuery({ accountId: user.id, listName: 'watchlist/movies', sessionId: localStorage.getItem('session_id'), page: 1 });

  useEffect(() => {
    refetchFavorites();
    refetchWatchlisted();
  }, []);

  console.log('favoriteMovies', favoriteMovies);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4" gutterBottom> My Profile </Typography>
        <Button color="inherit" onClick={logout}>
          Logout &nbsp; <ExitToApp />
        </Button>
      </Box>
      {!favoriteMovies?.results?.length && !watchlistMovies?.results?.length
        ? <Typography variant="h5" gutterBottom> Add favorites to you watchlist </Typography>
        : (
          <Box>
            <RatedCards title="Favorite Movies" data={favoriteMovies} />
            <RatedCards title="Watchlist Movies" data={watchlistMovies} />
          </Box>
        )}
    </Box>
  );
};

export default Profile;
