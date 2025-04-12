const express = require('express');
const db = require('../models');
const bcrypt = require('bcrypt');

exports.getOneUser = async (req, res) => {
  try {
    if (req.userId != req.params.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const result = await db.Profile.findOne({
      where: {
        id: req.params.id,
      },
      raw: true,
      include: 
        {
        association: 'auth',
        attributes: ['email', 'profileId'],
      },
    });
    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error('Get user error:', err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};
exports.updateOneUser = async (req, res) => {
  const profileData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    nid: req.body.nid,
    profilePhoto: req.body.profilePhoto,
    isMarried: req.body.isMarried,
    age: req.body.age,
  };
  try {
    if (req.userId != req.params.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const [updated] = await db.Profile.update(profileData, {
      where: {
        id: req.params.id,
      },
    });
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json([updated]);
  } catch (err) {
    console.error('Update user error:', err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};
exports.updateOneUserPassword = async (req, res) => {
  try {
    if (req.userId != req.params.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const user = await db.Auth.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const newHashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.Auth.update(
      { password: newHashedPassword },
      {
        where: {
          email: req.body.email,
        },
      }
    );
    return res.status(200).json({
      message: 'Password updated successfully!',
    });
  } catch (err) {
    console.error('Update password error:', err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};
exports.deleteOneUser = async (req, res) => {
  try {
    if (req.userId != req.params.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const deleted = await db.Profile.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(deleted);
  } catch (err) {
    console.error('Delete user error:', err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

exports.updateOneUserPicture = async (req, res) => {
  const profileData = {
   
    profilePhoto: req.file.filename,
    
  };
  try {
    if (req.userId != req.params.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const [updated] = await db.Profile.update(profileData, {
      where: {
        id: req.params.id,
      },
    });
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json([updated]);
  } catch (err) {
    console.error('Update picture error:', err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};
exports.getAllUser = async (req, res) => {
  try {
    const result = await db.Profile.findAll({
      raw: true,
      include: {
        association: 'auth',
        attributes: ['email', 'profileId'],
      },
    });
    return res.status(200).json(result);
  } catch (err) {
    console.error('Get all users error:', err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};
