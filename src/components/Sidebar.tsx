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
  Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import TimerIcon from '@mui/icons-material/Timer';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const [cleanDataDialogOpen, setCleanDataDialogOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editProfile, setEditProfile] = useState({
    name: userName,
    age: '',
    gender: '',
    avatar: userAvatar
  });

  const updateUserProfile = usePlankStore(state => state.updateUserProfile);
  
  const handleCleanDataClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drawer from closing
    setCleanDataDialogOpen(true);
  };

  const handleConfirmCleanData = useCallback(() => {    
    setCleanDataDialogOpen(false);
    usePlankStore.getState().reset();
    onClose();
  }, [ onClose]);

  const handleCloseDialog = () => {
    setCleanDataDialogOpen(false);
  };

  const handleEditProfile = () => {
    setEditProfileOpen(true);
  };

  const handleCloseEditProfile = () => {
    setEditProfileOpen(false);
  };

  const handleSaveProfile = () => {
    updateUserProfile({
      name: editProfile.name,
      age: editProfile.age,
      gender: editProfile.gender,
      avatar: editProfile.avatar
    });
    setEditProfileOpen(false);
  };

  return (
    <>
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
        >
          
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', height: 200, bgcolor: 'primary.main', color: 'white', pt: 6 }}>
              <Avatar 
                src={userAvatar}
                sx={{ width: 80, height: 80, mb: 1 }}
                onClick={handleEditProfile}
              >
                {userName?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {userName}
              </Typography>
            </Box>
          <Divider />
          <List>
            <ListItem button onClick={() => { onMenuItemClick('/'); onClose(); }}>
              <ListItemIcon>
                <TimerIcon />
              </ListItemIcon>
              <ListItemText primary="Timer" />
            </ListItem>
            <ListItem button onClick={() => { onMenuItemClick('/historical'); onClose(); }}>
              <ListItemIcon>
                <BarChartIcon />
              </ListItemIcon>
              <ListItemText primary="Historical Progress" />
            </ListItem>
            <ListItem button onClick={() => { onMenuItemClick('settings'); onClose(); }}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem button onClick={handleCleanDataClick}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              <ListItemText primary="Clean Data" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Dialog
        open={cleanDataDialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="clean-data-dialog-title"
      >
        <DialogTitle id="clean-data-dialog-title">
          Clean All Data
        </DialogTitle>
        <DialogContent>
          Are you sure you want to clean all data and restart? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmCleanData} color="error" autoFocus>
            Clean Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Profile Modal */}
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
    </>
  );
};

export default Sidebar;
