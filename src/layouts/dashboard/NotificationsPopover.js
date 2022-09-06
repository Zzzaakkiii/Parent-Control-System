import PropTypes from 'prop-types';
import { React, useState, useRef, useEffect, forwardRef } from 'react';
// @mui
import {
  Box,
  Badge,
  Tooltip,
  Divider,
  Typography,
  IconButton,
  List,
  ListSubheader,
  ListItemText,
  ListItemButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@mui/material';
// utils
import { fToNow } from '../../utils/formatTime';
// components
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import MenuPopover from '../../components/MenuPopover';

import api from '../../Services/ParentControlService';

const moment = require('moment');
// ----------------------------------------------------------------------

const _token = localStorage.getItem("token");
let timer = 1000;

export default function NotificationsPopover() {
  const anchorRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [activityNotifications, setActivityNotifications] = useState([]);

  const changeTimer = () => {
    if (timer < 100000) timer *= 2;
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await api.get("v2/unverified/users", {
        headers: {
          authorization: 'Bearer '.concat(_token),
        },
      });
      setNotifications(data.data.msg);
    }

    const fetchActivityNotifications = async () => {
      try {
        const data = await api.get("v1/get/admin/notification", {
          headers: {
            authorization: 'Bearer '.concat(_token),
          },
        });

        setActivityNotifications(data.data.msg);
      }
      catch (err) {
        console.log(err);
      }
    }

    const interval = setInterval(() => {
      fetchNotifications();
      fetchActivityNotifications();
      changeTimer();
    }, timer);

    return () => {
      clearInterval(interval);
    };
  })

  const totalUnRead = notifications.length + activityNotifications.length;

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
  };

  const removeItem = index => {
    activityNotifications.splice(index);
  }

  return (
    <>
      <IconButton
        ref={anchorRef}
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Approvals
              </ListSubheader>
            }
          >
            {notifications.map((notification) => (
              <NotificationItem key={notification._id} notification={notification} />
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                User Activity
              </ListSubheader>
            }
          >
            {activityNotifications.map((notification, index) => (
              < ActivityItem key={notification._id} notification={notification} index={index} removeItem={removeItem} />
            ))}
          </List>
        </Scrollbar>
      </MenuPopover>
    </>
  );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    created_at: PropTypes.string,
    email: PropTypes.string,
    first_name: PropTypes.string,
    is_admin_verified: PropTypes.string,
    is_blocked: PropTypes.bool,
    is_email_verification_on: PropTypes.bool,
    is_google_authentication_on: PropTypes.bool,
    last_login: PropTypes.string,
    last_name: PropTypes.string,
    role: PropTypes.string,
    updated_at: PropTypes.string,
    _id: PropTypes.string,
  }),
};

const Transition = forwardRef((props, ref) =>
  <Slide direction="up" ref={ref} {...props} />
);

function NotificationItem({ notification }) {
  const [openModal, setOPenModal] = useState(false);

  const handleModalOpen = () => {
    setOPenModal(true);
  };

  const handleModalClose = () => {
    setOPenModal(false);
  };

  const handleApproval = decision => {
    const approve = async () => {
      const request = {
        status: decision,
        id: notification._id,
      };

      try {
        const data = await api.put("v2/update/user/status", request, {
          headers: {
            authorization: 'Bearer '.concat(_token),
          }
        });
        return data;
      }
      catch (err) {
        console.log(err)
      }

      return 0;
    }
    approve();
    handleModalClose();
  }

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
      }}
      onClick={(e) => { e.preventDefault(); handleModalOpen(); }}
    >
      <ListItemText
        primary={`${notification.is_admin_verified} approval for new user: ${notification.first_name}`}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification.created_at)}
          </Typography>
        }
      />

      <Dialog
        open={openModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleModalClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Approve Signup for ${notification.first_name}`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <span>A new SignUp request has been recieved</span><br />
            <span>Email: {notification.email}</span>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleApproval("rejected")}>Reject</Button>
          <Button onClick={() => handleApproval("approved")}>Approve</Button>
        </DialogActions>
      </Dialog>
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

ActivityItem.propTypes = {
  notification: PropTypes.shape({
    activity: PropTypes.string,
    user: PropTypes.object,
    file_name: PropTypes.string,
    created_at: PropTypes.string,
    role: PropTypes.string,
    updated_at: PropTypes.string,
    _id: PropTypes.string,
  }),

  index: PropTypes.number,
  removeItem: PropTypes.func,
};

function ActivityItem({ notification, index, removeItem }) {

  const [openModal, setOPenModal] = useState(false);

  const handleModalOpen = () => {
    setOPenModal(true);
  };

  const handleModalClose = () => {
    setOPenModal(false);
  };

  const markAsRead = () => {
    removeItem(index);
    handleModalClose();
  }

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
      }}
      onClick={(e) => { e.preventDefault(); handleModalOpen(); }}
    >
      <ListItemText
        primary={`${notification.user.first_name} has recntly ${notification.activity} file: ${notification.file_name}`}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification.created_at)}
          </Typography>
        }
      />
      <Dialog
        open={openModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleModalClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'Activity details'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <span>User: {notification.user.first_name}</span><br />
            <span>Activity: {notification.activity}</span><br />
            <span>File: {notification.file_name}</span><br />
            <span>Activity Time: {moment(notification.created_at).format('dddd, MMMM Do YYYY, h:mm:ss a')}</span>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={markAsRead}>Mark Read</Button>
        </DialogActions>
      </Dialog>
    </ListItemButton>
  );
}