const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

//bring in user model
let User = require('../models/user');


//Register form
router.get('/register',(req,res)=>{
	res.render('register');
});

// register process

router.post('/register',(req,res)=>{
	const name = req.body.name;
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const password2 = req.body.password2;

	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'passwords do not match').equals(req.body.password);

	let errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else { 
		let newUser = new User({ 
			name:name,
			email:email,
			username:username,
			password:password
		});

		bcrypt.genSalt( 10 , (err, salt)=>{
			bcrypt.hash(newUser.password, salt, (err, hash)=>{
				if(err){
					console.log(err);
				}
				newUser.password = hash; 
				newUser.save((err)=>{
					if(err){
						console.log(err);
						return;
					}
					else{
						req.flash('success','you are now registered and can login');
						res.redirect('/users/login');
					}
				});
			});
		});
	}
});

router.get('/login',(req, res)=>{
	res.render('login');
});

module.exports = router;