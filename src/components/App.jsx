import React from 'react';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';

import useStyles from './styles';

import { Actors, MovieInformation, Movies, Profile, NavBar } from '.';

// / -> root -> all movies
// /asd123 -> movie information -> more

const App = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <NavBar />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Routes>
          <Route path="/" element={<h1> Testing Home page</h1>} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie/:id" element={<MovieInformation />} />
          <Route path="/actors/:id" element={<Actors />} />
          <Route path="/profile/:id" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
