import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setUser(null);
    };

    return (
        <AppBar position="static" style={{ backgroundColor: '#121212' }}>
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    <Link to="/" style={{ textDecoration: 'none', color: '#ffffff' }}>
                        My App
                    </Link>
                </Typography>
                <Box>
                    {user ? (
                        <>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit">
                                <Link to="/login" style={{ textDecoration: 'none', color: '#ffffff' }}>
                                    Login
                                </Link>
                            </Button>
                            <Button color="inherit">
                                <Link to="/register" style={{ textDecoration: 'none', color: '#ffffff' }}>
                                    Register
                                </Link>
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
