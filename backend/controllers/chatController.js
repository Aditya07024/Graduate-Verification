const Chat = require('../models/Chat');
const User = require('../models/User');
const Admin = require('../models/Admin');

// Get conversation between two users

// Get all conversations for admin view


// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { messageIds } = req.body;

       if (!Array.isArray(messageIds)) {
      return res.status(400).json({ error: 'messageIds must be an array' });
    }
    await Chat.updateMany(
      { _id: { $in: messageIds }, recipient: req.user._id },
      { $set: { read: true } }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Chat.countDocuments({
      recipient: req.user._id,
      read: false
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, recipientType, content } = req.body;

    // Debug: Log the current user
    console.log('Current user:', req.user);
    console.log('User ID:', req.user?._id);

    // Validate input
    if (!recipientId || !recipientType || !content) {
      return res.status(400).json({ 
        error: 'Recipient ID, type and content are required' 
      });
    }

    // Verify sender exists
    if (!req.user?._id) {
      return res.status(401).json({ error: 'Invalid sender' });
    }

    // Find recipient with error handling
    let recipient;
    try {
      recipient = recipientType === 'Admin' 
        ? await Admin.findById(recipientId)
        : await User.findById(recipientId);
    } catch (err) {
      console.error('Recipient lookup error:', err);
      return res.status(400).json({ error: 'Invalid recipient ID format' });
    }

    if (!recipient) {
      return res.status(404).json({ 
        error: 'Recipient not found',
        details: `No ${recipientType} found with ID ${recipientId}`
      });
    }

    // Rest of your controller remains the same...
    const message = new Chat({
      sender: req.user._id,
      senderModel: req.user.modelType,
      recipient: recipientId,
      recipientModel: recipientType,
      content,
      chatType: req.user.role === 'admin' ? 'support' : 'direct',
      read: false
    });

    await message.save();

    const populated = await Chat.findById(message._id)
      .populate('sender', 'firstName lastName email')
      .populate('recipient', 'firstName lastName email');

    req.io.to(recipientId).emit('receive-message', populated);
    
    if (req.user.role !== 'admin' && recipient.role !== 'admin') {
      req.io.to('admin-room').emit('new-conversation', populated);
    }

    return res.status(201).json(populated);
    
  } catch (error) {
    console.error('Message send error:', error);
    return res.status(500).json({ 
      error: 'Message sending failed',
      ...(process.env.NODE_ENV === 'development' && { 
        details: error.message,
        stack: error.stack 
      })
    });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const conversation = await Chat.find({
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id }
      ]
    })
    .sort('timestamp')
    .populate('sender', 'firstName lastName email')
    .populate('recipient', 'firstName lastName email');

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all conversations for admin
exports.getAllConversations = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const conversations = await Chat.find()
      .populate('sender', 'firstName lastName email')
      .populate('recipient', 'firstName lastName email')
      .sort('-createdAt');

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users for admin chat interface
exports.getChatUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const users = await User.find({}, 'firstName lastName email');
    const admins = await Admin.find({}, 'email role');

    res.json({
      users: users.map(u => ({ ...u._doc, modelType: 'User' })),
      admins: admins.map(a => ({ ...a._doc, modelType: 'Admin' }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAssignedAdmin = async (req, res) => {
  try {
    // Find available admins (excluding registrars if needed)
    const admin = await Admin.findOne({ 
      isAvailable: true,
      role: 'admin' // Only assign to admins, not registrars
    }).sort({ lastAssigned: 1 });
    
    if (!admin) {
      return res.status(404).json({ 
        success: false,
        message: 'No admin available at the moment' 
      });
    }

    // Update admin's last assigned time and add user to active chats
    admin.lastAssigned = new Date();
    admin.activeChats.push(req.user._id);
    await admin.save();

    res.json({
      success: true,
      admin: {
        _id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Error assigning admin:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error assigning support admin' 
    });
  }
};