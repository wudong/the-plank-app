import React, { useState, useCallback } from 'react';
import { usePlankStore } from '../store/plank-store';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { AuthDialog } from './auth-dialog';
import EditIcon from '@mui/icons-material/Edit';
import TimerIcon from '@mui/icons-material/Timer';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import StorageIcon from '@mui/icons-material/Storage';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

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
  userAvatar = '/default-avatar.png',
}) => {
  const theme = useTheme();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { user, loading, signOut } = usePlankStore();
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editProfile, setEditProfile] = useState({
    name: userName,
    age: '',
    gender: '',
    avatar: userAvatar,
  });

  const updateUserProfile = usePlankStore((state) => state.updateUserProfile);

  const handleEditProfile = () => {
    setEditProfileOpen(true);
  };

  const handleCloseEditProfile = () => {
    setEditProfileOpen(false);
  };

  const handleSaveProfile = () => {
    updateUserProfile(editProfile.name, editProfile.avatar);
    setEditProfileOpen(false);
  };

  return (
    <>
      <Drawer anchor="left" open={open} onClose={onClose}>
        <Box sx={{ width: 250 }} role="presentation">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              my: 4,
            }}
          >
            <Avatar
              src={userAvatar}
              sx={{
                width: 80,
                height: 80,
                mb: 1,
                border: `3px solid ${theme.palette.background.paper}`,
                boxShadow: theme.shadows[3],
                backgroundColor: theme.palette.secondary.light,
              }}
            >
              {userName?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 500,
                }}
              >
                {userName}
              </Typography>
              <IconButton size="small" sx={{ ml: 1 }} onClick={handleEditProfile}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Divider />
          <List>
            <ListItem
              button
              onClick={() => {
                onMenuItemClick('/');
                onClose();
              }}
            >
              <ListItemIcon>
                <TimerIcon />
              </ListItemIcon>
              <ListItemText primary="Timer" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                onMenuItemClick('/historical');
                onClose();
              }}
            >
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Historical Progress" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                onMenuItemClick('settings');
                onClose();
              }}
            >
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem
              button
              onClick={() => {
                onMenuItemClick('/data');
                onClose();
              }}
            >
              <ListItemIcon>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText primary="Data Management" />
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem
              button
              onClick={loading ? undefined : user ? signOut : () => setAuthDialogOpen(true)}
            >
              <ListItemIcon>
                {loading ? <CircularProgress size={24} /> : user ? <LogoutIcon /> : <LoginIcon />}
              </ListItemIcon>
              <ListItemText primary={loading ? 'Loading...' : user ? 'Sign Out' : 'Sign In'} />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Dialog open={editProfileOpen} onClose={handleCloseEditProfile}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            variant="outlined"
            value={editProfile.name}
            onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Age"
            fullWidth
            variant="outlined"
            type="number"
            value={editProfile.age}
            onChange={(e) => setEditProfile({ ...editProfile, age: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Gender"
            fullWidth
            variant="outlined"
            value={editProfile.gender}
            onChange={(e) => setEditProfile({ ...editProfile, gender: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Avatar URL"
            fullWidth
            variant="outlined"
            value={editProfile.avatar}
            onChange={(e) => setEditProfile({ ...editProfile, avatar: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditProfile}>Cancel</Button>
          <Button onClick={handleSaveProfile} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      <AuthDialog open={authDialogOpen} onClose={() => setAuthDialogOpen(false)} />
    </>
  );
};

export default Sidebar;
