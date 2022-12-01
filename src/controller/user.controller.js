const express = require('express');
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Auth } = require('../config/sequelize');
require('dotenv').config();

exports.getOneUser = async (req, res) => {
  try {
    if (req.userId != req.params.id) {
      throw 'user is not valid';
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
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
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
      throw 'user is not valid';
    }
    const result = await db.Profile.update(profileData, {
      where: {
        id: req.params.id,
      },
    });
    return res.json(result);
  } catch (e) {
    console.log('error updated user:', e);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
exports.updateOneUserPassword = async (req, res) => {
  try {
    if (req.userId != req.params.id) {
      throw 'user is not valid';
    }
   
    const user = await db.Auth.findOne({
      attributes: ['id', 'email', 'password'],
      where: {
        email: req.body.email,
      },
    });
    const newHashedPassword = await bcrypt.hash(req.body.password, 10);
    if (user) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.dataValues.password
      );

      if (isValidPassword) {
        const authData = {
          email: req.body.email,
          password: newHashedPassword,
        };
        const result = await db.Auth.update(authData, {
          where: {
            email: req.body.email,
          },
        });
        res.status(200).json({
          message: 'password updated  successful!',
        });
      }
    }
  } catch (e) {
    console.log('error updated user:', e);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
exports.deleteOneUser = async (req, res) => {
  try {
    if (req.userId != req.params.id) {
      throw 'user is not valid';
    }
    const result = await db.Profile.destroy({
      where: {
        id: req.params.id,
      },
      include: 
        {
          association: 'auth',
          cascade: true,
        },
      
    });
    return res.json(result);
  } catch (e) {
    console.log('error deleting user:', e);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateOneUserPicture = async (req, res) => {
  const profileData = {
   
    profilePhoto: req.file.filename,
    
  };
  try {
    if (req.userId != req.params.id) {
      throw 'user is not valid';
    }
    const result = await db.Profile.update(profileData, {
      where: {
        id: req.params.id,
      },
    });
    return res.json(result);
  } catch (e) {
    console.log('error updated user:', e);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
exports.getAllUser = async (req, res) => {
  try {
    const result = await db.Profile.findAll({
      raw: true,
      include: 
        {
          association: 'auth',
          attributes: ['email', 'profileId'],
        },
      
    });
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
