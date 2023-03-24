import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Drawer, Button, Avatar, useMediaQuery } from '@mui/material';
import { Menu, AccountCircle, Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { ColorModeContext } from '../../utils/ToggleColorMode';
import useStyles from './styles';
// import { Sidebar, Search } from '..';
import Sidebar from '../Sidebar/Sidebar';
import Search from '../Search/Search';
import { fetchToken, createSessionId, moviesApi } from '../../utils';
import { setUser, userSelector } from '../features/auth';

const NavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const classes = useStyles();
  const isMobile = useMediaQuery('(max-width: 600px)');
  const theme = useTheme();

  const colorMode = React.useContext(ColorModeContext);

  const token = localStorage.getItem('request_token');
  const sessionIdFromLoacalStorage = localStorage.getItem('session_id');
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(userSelector);

  console.log('user', user);

  useEffect(() => {
    const logInUser = async () => {
      if (token) {
        if (sessionIdFromLoacalStorage) {
          const { data: useData } = await moviesApi.get(`/account?session_id=${sessionIdFromLoacalStorage}`);
          dispatch(setUser(useData));
        } else {
          const sessionId = await createSessionId();
          const { data: useData } = await moviesApi.get(`/account?session_id=${sessionId}`);
          console.log('session id that got created ', sessionId);

          dispatch(setUser(useData));
        }
      }
    };
    logInUser();
  }, [token]);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            style={{ outline: 'none' }}
            onClick={() => setMobileOpen((prevMobileOpen) => !prevMobileOpen)}
            className={classes.menuButton}
          >
            <Menu />
          </IconButton>
          )}
          <IconButton color="inherit" sx={{ ml: 1 }} onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          {!isMobile && <Search />}
          <div>
            {!isAuthenticated
              ? (
                <Button
                  color="inherit"
                  onClick={fetchToken}
                >
                  Login &nbsp; <AccountCircle />
                </Button>
              )
              : (
                <Button
                  color="inherit"
                  component={Link}
                  to={`/profile/${user.id}`}
                  className={classes.linkButton}
                  onClick={() => {}}
                >
                  {!isMobile && <> My Movies &nbsp; </>}
                  <Avatar
                    style={{ width: '30px', height: '30px' }}
                    alt="Profile"
                    // src="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50"
                    src={`https://www.themoviedb.org/t/p/w45_and_h64_face${user?.avatar?.tmdb?.avatar_path}.jpg`}
                  />
                </Button>
              )}
          </div>
          {isMobile && <Search />}
        </Toolbar>
      </AppBar>

      <div>
        <nav className={classes.drawer}>
          {isMobile ? (
            <Drawer
              variant="temporary"
              anchor="right"
              open={mobileOpen}
              onClose={() => setMobileOpen((prevMobileOpen) => !prevMobileOpen)}
              classes={{ paper: classes.drawerPaper }}
              ModalProps={{ keepMounted: true }}
            >
              <Sidebar setMobileOpen={setMobileOpen} />
            </Drawer>

          ) : (
            <Drawer classes={{ paper: classes.drawerPaper }} variant="permanent" open>
              <Sidebar setMobileOpen={setMobileOpen} />
            </Drawer>
          )}

        </nav>

      </div>
    </>
  );
};

export default NavBar;
