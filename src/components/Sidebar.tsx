import React from 'react';
import { Drawer, Box, List, ListItem, ListItemText, Avatar, Typography, Divider } from '@mui/material';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onMenuItemClick: (path: string) => void;
  userName?: string;
  userAvatar?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  open, 
  onClose, 
  onMenuItemClick,
  userName = 'User',
  userAvatar,
}) => {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
    >
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={onClose}
        onKeyDown={onClose}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar 
            src={userAvatar}
            sx={{ width: 40, height: 40 }}
          >
            {userName?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="subtitle1">
            {userName}
          </Typography>
        </Box>
        <Divider />
        <List>
          <ListItem button onClick={() => onMenuItemClick('/')}>
            <ListItemText primary="Timer" />
          </ListItem>
          <ListItem button onClick={() => onMenuItemClick('/historical')}>
            <ListItemText primary="Historical Progress" />
          </ListItem>
          <ListItem button onClick={() => onMenuItemClick('settings')}>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
