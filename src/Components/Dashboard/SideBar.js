import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu as MenuContext } from '../../Context/MenuContext';
import Cookie from "cookie-universal";
import { links } from './NavLink';
import { USER } from '../../API/Api';
import { Axios } from '../../API/Axios';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
    Tooltip
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const drawerWidth = 240;
const closedDrawerWidth = 64;

export default function SideBar() {
    const menue = useContext(MenuContext);
    const isOpen = menue.isOpen;
    const [user, setUser] = useState({});
    const cookie = Cookie();
    const token = cookie.get("token");

    useEffect(() => {
        Axios.get(USER)
            .then(res => setUser(res.data))
            .catch((error) => console.log(error));
    }, [token]);

    return (
        <Drawer
            variant="permanent"
            open={isOpen}
            sx={{
                width: isOpen ? drawerWidth : closedDrawerWidth,
                flexShrink: 0,
                mt: '64px',
                '& .MuiDrawer-paper': {
                    width: isOpen ? drawerWidth : closedDrawerWidth,
                    backgroundColor: '#b71c1c',
                    color: '#fff',
                    overflowX: 'hidden',
                    transition: 'width 0.3s',
                    borderRight: 0,
                    boxShadow: 3,
                    mt: '64px',
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mb: 1 }} />
            <List>
                {links.map((link, key) => (
                    link.role.includes(user.role) && (
                        <Tooltip
                            key={key}
                            title={!isOpen ? link.name : ''}
                            placement="right"
                            arrow
                        >
                            <ListItem disablePadding sx={{ display: 'block' }}>
                                <ListItemButton
                                    component={NavLink}
                                    to={link.path}
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: isOpen ? 'initial' : 'center',
                                        px: 2.5,
                                        borderRadius: 2,
                                        mb: 1, // Add gap between buttons
                                        '&.active': {
                                            backgroundColor: 'rgba(255,255,255,0.18)', // subtle highlight, not white
                                            color: '#fff',
                                            '& .MuiListItemIcon-root': {
                                                color: '#fff',
                                            },
                                        },
                                        color: '#fff',
                                        '&:hover': {
                                            backgroundColor: 'rgba(255,255,255,0.12)',
                                        },
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: isOpen ? 2 : 'auto',
                                            justifyContent: 'center',
                                            color: 'inherit',
                                        }}
                                    >
                                        <FontAwesomeIcon icon={link.icon} />
                                    </ListItemIcon>
                                    {isOpen && <ListItemText primary={link.name} />}
                                </ListItemButton>
                            </ListItem>
                        </Tooltip>
                    )
                ))}
            </List>
            <Box sx={{ flexGrow: 1 }} />
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', mt: 1 }} />
        </Drawer>
    );
}