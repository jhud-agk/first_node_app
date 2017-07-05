const LocalStrategy = require('passport-local').strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');