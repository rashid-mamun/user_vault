const express = require('express');
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const registerSchemaValidator = require('../validator/register.validator');

exports.register = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const authData = {
    email: req.body.email,
    password: hashedPassword,
  };
  const profileData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    nid: req.body.nid,
    profilePhoto: req.body.profilePhoto,
    isMarried: req.body.isMarried,
    age: req.body.age,
  };
  const t = await db.sequelize.transaction();
  try {
    await registerSchemaValidator.validateAsync(req.body);

    const profile = await db.Profile.create(profileData, { transaction: t });
    let auth;
    if (profile && profile.id) {
      authData.profileId = profile.id;
      auth = await db.Auth.create(authData, { transaction: t });
    } else {
      throw new Error('Profile creation failed');
    }
    await t.commit();
    return res.status(201).json({
      message: 'Record created successfully!',
      response: { profile, auth },
    });
  } catch (error) {
    console.error('Registration error:', error);
    await t.rollback();
    return res.status(400).json({
      message: 'Failed to create record',
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await db.Auth.findOne({
      attributes: ['id', 'email', 'password'],
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed: User not found',
      });
    }
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Authentication failed: Invalid password',
      });
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );
    return res.status(200).json({
      access_token: token,
      message: 'Login successful!',
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      error: 'Internal server error: ' + err.message,
    });
  }
};
