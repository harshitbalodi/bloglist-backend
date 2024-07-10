// controllers/friends.js

const express = require('express');
const User = require('../models/user');
const friendsRouter = express.Router();

// Send a friend request
friendsRouter.post('/request/:userId', async (req, res) => {
  const { userId } = req.params;
  const { currentUserId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send('User not found');

    user.friendRequests.push(currentUserId);
    await user.save();

    res.status(200).send('Friend request sent');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Accept a friend request
friendsRouter.post('/accept/:userId', async (req, res) => {
  const { userId } = req.params;
  const { currentUserId } = req.body;

  try {
    const user = await User.findById(currentUserId);
    const friend = await User.findById(userId);

    if (!user || !friend) return res.status(404).send('User not found');

    user.friends.push(friend._id);
    friend.friends.push(user._id);

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== userId);
    
    await user.save();
    await friend.save();

    res.status(200).send('Friend request accepted');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Reject a friend request
friendsRouter.post('/reject/:userId', async (req, res) => {
  const { userId } = req.params;
  const { currentUserId } = req.body;

  try {
    const user = await User.findById(currentUserId);
    if (!user) return res.status(404).send('User not found');

    user.friendRequests = user.friendRequests.filter(id => id.toString() !== userId);
    
    await user.save();

    res.status(200).send('Friend request rejected');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Fetch friend requests
friendsRouter.get('/requests', async (req, res) => {
  const currentUserId = req.user.userId;
  console.log("/requests",req.user);
  try {
    const user = await User.findById(currentUserId).populate('friendRequests', 'username name');
    if (!user) return res.status(404).send('User not found');

    res.status(200).send(user.friendRequests);
  } catch (error) {
    console.log("error inside /requests",error);
    res.status(500).send('Server error');
  }
});

// Fetch friends list
friendsRouter.get('/', async (req, res) => {
  const currentUserId  = req.user.userId;
  console.log("/friends",req.user);
  try {
    const user = await User.findById(currentUserId).populate('friends', 'username name');
    if (!user) return res.status(404).send('User not found');

    res.status(200).send(user.friends);
  } catch (error) {
    console.log("error inside /friends",error);
    res.status(500).json({error, message: 'Server error'});
  }
});

module.exports = friendsRouter;
