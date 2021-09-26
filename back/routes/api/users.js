const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
//const Users = require('models/Users');
const db = require('../../models');
const logger = require('../../logger');
const _ = require('lodash');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { body } = require('express-validator');
const crawler = require('../../apify/crawler');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
var twilioClient = new twilio(
	process.env.TWILIO_ACCOUNT_SID,
	process.env.TWILIO_AUTH_TOKEN
);

AWS.config.update({
	region: 'us-east-1',
});

const s3 = new AWS.S3();

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/jpeg' ||
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg'
	) {
		cb(null, true);
	} else {
		cb(new Error('Invalid file type, only JPEG and PNG is allowed!'), false);
	}
};

const upload = multer({
	fileFilter,
	storage: multerS3({
		acl: 'public-read',
		s3: s3,
		bucket: 'gooff',
		metadata: function (req, file, cb) {
			cb(null, { fieldName: 'TESTING_METADATA' });
		},
		key: function (req, file, cb) {
			cb(null, 'images/' + Date.now() + file.originalname);
		},
	}),
	limits: { fileSize: 1024 * 1024 },
});
//POST for new user registration using email to verify account
router.post(
	'/ecreate',
	auth.optional,
	[
		body('username').escape(),
		body('email').escape(),
		body('firstname').escape(),
		body('lastname').escape(),
		body('age').escape(),
		body('location').escape(),
		body('gender').escape(),
		body('phonenumber').escape(),
		body('countrycode').escape(),
		body('password').escape(),
		body('birthdate').escape(),
	],
	(req, res, next) => {
		//const { body: { user } } = req;
		//console.log(req);
		const user = req.body;
		console.log('PHONE NUMBER HELLLO' + user.phonenumber);
		console.log(user);
		if (!user.username) {
			return res.status(422).json({
        error: "Username is required"
			});
		}
		if (!user.email) {
			return res.status(422).json({
        error: "email is required"
			});
		}
		if (!user.firstname) {
			return res.status(422).json({
        error: "firstname is required"
			});
		}
		if (!user.lastname) {
			return res.status(422).json({
        error: "lastname is required"
			});
		}
		/*
    if(!user.age){
        return res.status(422).json({
            errors: {
                age: 'is required',
            }
        })
    }*/
		if (!user.location) {
			return res.status(422).json({
        error: "location is required"
			});
		}
		if (!user.gender) {
			return res.status(422).json({
        error: "gender is required"
			});
		}
		if (!user.phonenumber) {
			return res.status(422).json({
        error: "phonenumber is required"
			});
		}
		if (!user.password) {
			return res.status(422).json({
        error: "password is required"
			});
		}
		if (!user.birthdate) {
			return res.status(422).json({
        error: "birthdate is required"
			});
		}
		/*
    if(db.User.findOne({
      where: {
        username: user.username
      }
    })){
      return res.status(422).json({
        errors: {
          username: 'is already taken'
        }
      })
    }
    */
		//calculate birthday function
		function calculate_age(dob) {
			var diff_ms = Date.now() - dob.getTime();
			var age_dt = new Date(diff_ms);

			return Math.abs(age_dt.getUTCFullYear() - 1970);
		}
		function calculate_code() {
			let code = Math.floor(100000 + Math.random() * 900000);
			return code;
		}
		db.User.create({
			username: user.username,
			firstname: user.firstname,
			lastname: user.lastname,
			name: user.firstname + ' ' + user.lastname,
			email: user.email,
			age: calculate_age(new Date(user.birthdate)),
			location: user.location,
			gender: user.gender,
			password: user.password,
			admin: user.admin || '',
			host: user.host || '',
			phonenumber: user.phonenumber,
			birthdate: user.birthdate,
			user_ver: 0,
			smscode: calculate_code(),
			followercount: user.followercount || 0,
			followingcount: user.followingcount || 0,
			user_tok: crypto.randomBytes(16).toString('hex'), //create the token
		})
			.then((createdUser) => {
				logger(
					'User ' +
						createdUser.id +
						' created With username ' +
						createdUser.username
				);
				db.Profile.create({
					UserId: createdUser.id,
				}).then(() => {
					db.UserArticle.create({
						UserId: createdUser.id,
					})
						.then(() => {
							db.Folder.create({
								UserId: createdUser.id,
								foldername: 'Business/Tech',
							});
						})
						.then(() => {
							db.Folder.create({
								UserId: createdUser.id,
								foldername: 'Art/Literature',
							});
						})
						.then(() => {
							db.Folder.create({
								UserId: createdUser.id,
								foldername: 'Miscellaneous',
							});
						})
						.then(() => {
							//would send email here
							// Send email (use credintials of SendGrid)
							console.log('createdUser.smscode: ', createdUser.smscode); // Testing Purposes delete if not needed to check
							const msg = {
								to: createdUser.email, // Change to your recipient
								from: 'go.offmedia@gmail.com', // Change to your verified sender
								subject: 'Email Verification Link',
								text:
									'Hello ' +
									createdUser.firstname +
									',\n\n' +
									'Please verify your account by entering the number: ' +
									createdUser.smscode +
									'on the website' +
									'\n\nThank You!\n',
								html:
									'Hello ' +
									createdUser.firstname +
									',\n\n' +
									'Please verify your account by entering the number: ' +
									createdUser.smscode +
									' on the website' +
									'\n\nThank You!\n',
								//change into an HREF
							};

							sgMail
								.send(msg)
								.then(() => {
									console.log('Email sent');
									console.log(msg.text);
								})
								.catch((error) => {
									console.error(error);
								});
							// return res.redirect('/verify');
							//return res.redirect('/login'); //redirect to check email verification page
						});
					return res.json({ Status: 'Successfully created account' }); // return res.redirect('/ver_account');
				});
			})
			.catch((err) => {
				res.json({ error: err.errors[0].message });
			});
	}
);
//router post for sms account creation
router.post(
	'/screate',
	auth.optional,
	[
		body('username').escape(),
		body('email').escape(),
		body('firstname').escape(),
		body('lastname').escape(),
		body('age').escape(),
		body('location').escape(),
		body('gender').escape(),
		body('phonenumber').escape(),
		body('countrycode').escape(),
		body('password').escape(),
		body('birthdate').escape(),
	],
	(req, res, next) => {
		//const { body: { user } } = req;
		//console.log(req);
		const user = req.body;
		console.log('PHONE NUMBER HELLLO' + user.phonenumber);
		console.log(user);
		if (!user.username) {
			return res.status(422).json({
				error: "Username is required"
			});
		}
		if (!user.email) {
			return res.status(422).json({
        error: "Email is required"
			});
		}
		if (!user.firstname) {
			return res.status(422).json({
        error: "First name is required"
			});
		}
		if (!user.lastname) {
			return res.status(422).json({
        error: "Last name is required"
			});
		}
		/*
    if(!user.age){
        return res.status(422).json({
            errors: {
                age: 'is required',
            }
        })
    }*/
		if (!user.location) {
			return res.status(422).json({
        error: "Location is required"
			});
		}
		if (!user.gender) {
			return res.status(422).json({
        error: "Gender is required"
			});
		}
		if (!user.phonenumber) {
			return res.status(422).json({
        error: "Phone number is required"
			});
		}
		if (!user.password) {
			return res.status(422).json({
        error: "Password is required"
			});
		}
		if (!user.birthdate) {
			return res.status(422).json({
        error: "Birthdate is required"
			});
		}
		/*
    if(db.User.findOne({
      where: {
        username: user.username
      }
    })){
      return res.status(422).json({
        errors: {
          username: 'is already taken'
        }
      })
    }
    */
		//calculate birthday function
		function calculate_age(dob) {
			var diff_ms = Date.now() - dob.getTime();
			var age_dt = new Date(diff_ms);

			return Math.abs(age_dt.getUTCFullYear() - 1970);
		}
		function calculate_code() {
			let code = Math.floor(100000 + Math.random() * 900000);
			return code;
		}
		db.User.create({
			username: user.username,
			firstname: user.firstname,
			lastname: user.lastname,
			name: user.firstname + ' ' + user.lastname,
			email: user.email,
			age: calculate_age(new Date(user.birthdate)),
			location: user.location,
			gender: user.gender,
			password: user.password,
			admin: user.admin || '',
			host: user.host || '',
			phonenumber: user.phonenumber,
			birthdate: user.birthdate,
			user_ver: 0,
			smscode: calculate_code(),
			followercount: user.followercount || 0,
			followingcount: user.followingcount || 0,
			user_tok: crypto.randomBytes(16).toString('hex'), //create the token
		})
			.then((createdUser) => {
				logger(
					'User ' +
						createdUser.id +
						' created With username ' +
						createdUser.username
				);
				db.Profile.create({
					UserId: createdUser.id,
				}).then(() => {
          console.log("test 0")
					db.UserArticle.create({
						UserId: createdUser.id,
					})
						.then(() => {
							db.Folder.create({
								UserId: createdUser.id,
								foldername: 'Business/Tech',
							});
							console.log("test 1")
						})
						.then(() => {
							db.Folder.create({
								UserId: createdUser.id,
								foldername: 'Art/Literature',
							});
							console.log("test 2")
						})
						.then(() => {
							db.Folder.create({
								UserId: createdUser.id,
								foldername: 'Miscellaneous',
							});
							console.log("test 3")
						})
						.then(() => {
							//would send email here
							// Send email (use credintials of SendGrid)
							//send sms message with six digit number
							console.log('createdUser.smscode: ', createdUser.smscode); // Testing Purposes delete if not needed to check
							twilioClient.messages.create({
								to: createdUser.phonenumber,
								from: process.env.TWILIO_PHONE_NUMBER,
								body:
									"Hi, it's Go Off! Here is the six digit number to verify your account:" +
									createdUser.smscode,
							});

							// return res.redirect('/verify');
							//return res.redirect('/login'); //redirect to check email verification page
						});
					return res.json({ Status: 'Successfully created account!' }); // return res.redirect('/ver_account');
				});
			})
			.catch((err) => {
				res.json({ error: err.errors[0].message });
			});
	}
);

//POST for user login
router.post('/login', auth.optional, async (req, res, next) => {
	//const { body: { user } } = req.body;
	const user = req.body;
	if (!user.username) {
		return res.status(422).json({
			errors: {
				username: 'is required',
			},
		});
	}

	if (!user.password) {
		return res.status(422).json({
			errors: {
				password: 'is required',
			},
		});
	}

	var ver = await db.User.findOne({
		where: {
			username: user.username,
		},
	});
	if (!ver) {
		return res.status(422).json({
			errors: {
				error: 'username or password incorrect',
			},
		});
	} else {
		if (ver.user_ver == 0) {
			return res.status(422).json({
				errors: {
					verification: 'is required',
				},
			});
		}
	}
	if(!ver.validPassword(user.password)){
		return res.status(400).json({
			errors:{
				verification:'password incorrect'
			}
		})
	}
	//CHECKKKK IF VERIFIED --> DUNNO ERROR MESSAGE
	//user IS THE FOOOOOOOOOOORM
	//redirect them to the check email for verification page
	//else{authenticate}
	//!#

	return passport.authenticate('local', (err, passportUser, info) => {
		let token;
		if (err) {
			//return next(err);
		}
		 console.log(passportUser);
		try{
			if (passportUser) {
				const user = passportUser;
				user.token = user.generateJWT();
				res.cookie('authJWT', user.token, {
					httpOnly: true,
					signed: true,
				})
			}
		}catch(err){
			console.log(err)
			return res.sendStatus(400)
			//return res.redirect('/profiles/' + passportUser.username);
			//let myRedirect = 'return res.redirect('/profiles/' + passportUser.username);'
			// return res.redirect('/profiles/' + passportUser.username);
		}
		
		console.log(token) //!
		return res.sendStatus(200).info
	})(req, res, next);
});

//route for loginRedirect
router.post('/loginRedirect', auth.optional, async (req, res, next) => {
	//const { body: { user } } = req.body;
	const user = req.body;

	if (!user.username) {
		return res.status(422).json({
			errors: {
				username: 'is required',
			},
		});
	}

	if (!user.password) {
		return res.status(422).json({
			errors: {
				password: 'is required',
			},
		});
	}

	var ver = await db.User.findOne({
		where: {
			username: user.username,
		},
	});
	if (!ver) {
		return res.status(422).json({
			errors: {
				error: 'username or password incorrect',
			},
		});
	} else {
		if (ver.user_ver == 0) {
			return res.status(422).json({
				errors: {
					verification: 'is required',
				},
			});
		}
	}

	//CHECKKKK IF VERIFIED --> DUNNO ERROR MESSAGE
	//user IS THE FOOOOOOOOOOORM
	//redirect them to the check email for verification page
	//else{authenticate}

	return passport.authenticate('local', (err, passportUser, info) => {
		if (err) {
			return next(err);
		}
		// console.log(passportUser);
		if (passportUser) {
			const user = passportUser;
			user.token = passportUser.generateJWT();
			res.cookie('authJWT', user.toAuthJSON().token, {
				httpOnly: true,
				signed: true,
			});
			//return res.redirect('/profiles/' + passportUser.username);
			//let mylink = req.body
			let myRedirect = req.body.redirectLinkName;
			console.log(myRedirect, 'tsdasdfafsf');
			return res.redirect(myRedirect);
		}

		return res.sendStatus(400).info;
	})(req, res, next);
});

//POST for updating user info
router.post(
	'/update',
	upload.single('file'),
	auth.required,
	[
		body('username').escape(),
		body('email').escape(),
		body('firsname').escape(),
		body('lastname').escape(),
		body('age').escape(),
		body('location').escape(),
		body('gender').escape(),
		body('phonenumber').escape(),
		body('password').escape(),
		body('bio').escape(),
	],
	(req, res, next) => {
		const {
			payload: { id },
		} = req;
		let request = {
			username: req.body.username,
			email: req.body.email,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			age: req.body.age,
			location: req.body.location,
			gender: req.body.gender,
			password: req.body.password,
			phonenumber: req.body.phonenumber,
			bio: req.body.bio,
			followercount: req.body.followercount,
			followingcount: req.body.followingcount,
		};
		//check if first or last name was filled out in the form
		if (req.body.firstname != '' || req.body.lastname != '') {
			request.name = req.body.firstname + ' ' + req.body.lastname;
		}
		//Check if file was submitted
		if (req.file) {
			request.ppic = req.file.location;
		}

		requestfin = _.pickBy(request, _.identity); // <--- Will remove empty | null | undefined
		//logging updates
		for (var key in requestfin) {
			if (key == 'password') {
				logger('User ' + id + ' updated their password');
			} else {
				logger(
					'User ' +
						id +
						' updated their ' +
						key +
						' from ' +
						req.payload[key] +
						' to ' +
						request[key]
				);
			}
		}
		return db.User.update(requestfin, {
			where: {
				id: id,
			},
			individualHooks: true,
		})
			.then(() => {
				db.Profile.update(requestfin, {
					where: {
						userId: id,
					},
				});
			})
			.then(() => {
				db.User.findOne({
					where: {
						id: id,
					},
				}).then((user) => {
					if (!user) {
						return res.sendStatus(400);
					}
					user.token = user.generateJWT();
					res.cookie('authJWT', user.toAuthJSON().token, {
						httpOnly: true,
						signed: true,
					});
					// return res.redirect('/profiles/' + user.username);
				});
			});
	}
);

router.post('/follower_update', auth.required, (req, res, next) => {
	//id of logged in user

	var username = req.body.username;
	let id = req.body.id;

	//find username in db
	return db.User.findOne({
		where: {
			username: username,
		},
	}).then((user) => {
		if (!user) {
			return res.sendStatus(400);
		}
		var prof = { user: user.getUserInfo() };

		db.Follower.findOne({
			where: { follower: id, followed: user.id },
		}).then((follower) => {
			if (!follower) {
				prof.user['is_following'] = false;

				db.Follower.create({
					follower: id,
					followed: user.id,
				});
				db.User.increment(
					{
						followingcount: +1,
					},
					{
						where: {
							id: id,
						},
					}
				);
				db.User.increment(
					{
						followercount: +1,
					},
					{
						where: {
							username: username,
						},
					}
				);
				return res.status(200).json({ followingStatus: true });
			} else {
				db.Follower.destroy({
					where: {
						follower: id,
						followed: user.id,
					},
				});
				db.User.increment(
					{
						followingcount: -1,
					},
					{
						where: {
							id: id,
						},
					}
				);
				db.User.increment(
					{
						followercount: -1,
					},
					{
						where: {
							username: username,
						},
					}
				);
				// return res.redirect('/profiles/' + username);

				return res.status(200).json({ followingStatus: false });
			}
		});
	});
});

router.get('/all', auth.required, (req, res, next) => {
	return db.User.findAll({
		attributes: ['username', 'name'],
	}).then((users) => {
		//return res.json(JSON.stringify(users));
		return res.json(users);
	});
});

router.get('/getuser/:id', auth.optional, (req, res, next) => {
	const id = req.params.id;
	/* made small change to use param for id
	const {
		payload: { username },
	} = req;
	*/
	var data = []
	try{
		let u = db.User.findOne({
			where: {
				id: id
			}
		})
		let p = db.Profile.findOne({
			where: {
				id: id
			}
		})
	
		data.push({
			'HostName': u.username,
			'pfpic': p.ppic,
		})
		return res.json(data)
	}catch(err){
		return res.status(500).send({error:`Id not valid: ${err}`})
	}

});

//GET for email verification
router.get('/verification', auth.optional, (req, res, next) => {
	var sentEmail = req.query['email'];
	var sentSMSCode = req.query['smscode'];

	db.User.findOne({
		where: {
			email: sentEmail,
		},
	}).then((user) => {
		if (!user) {
			return res.status(401).send({
				error: 'We were unable to find a user for this verification. Please Sign Up!',
			});
		} else if (user.user_ver == 1) {
			return res.status(200).send({ 
        error: 'User has been already verified. Please Login'
      });
		} else {
			if (user.smscode == sentSMSCode) {
				user.user_ver = 1;
				user
					.save()
					.then((saveUser) => {
						// return res.redirect('/login');
						res.json({ redirect: '/login' });
					})
					.catch((err) => {
						return res.status(500).send({ error: err.message });
					});
				/*
      user.save(function (err) {
        // error occur
        if(err){
            return res.status(500).send({msg: err.message});
        }
        // account successfully verified
        else{
          return res.redirect('/login');
        }
    });*/
			} else {
				return res.status(401).send({
					error: 'We were unable to find a user for this verification. Please SignUp!',
				});
			}
		}
	});
});

//GET authenticated user
router.get('/current', auth.required, (req, res, next) => {
	const {
		payload: { username },
	} = req;
	return db.User.findOne({
		where: {
			username: username,
		},
	}).then((user) => {
		if (!user) {
			return res.sendStatus(400);
		}
		return res.status(200).json({ user: user.getUserInfo() });
	});
});

router.get('/following', auth.optional, (req, res, next) => {
	const {
		payload: { id },
	} = req;
	const {
		payload: { username },
	} = req;

	//finds username in database
	return db.User.findOne({
		where: {
			username: username,
		},
	}).then((user) => {
		//checks if the person accessing the file is the user
		if (!user) {
			return res.sendStatus(400);
		}
		//find all users that we follow
		db.Follower.findAll({
			where: { follower: id },
		}).then(async (follower) => {
			let data = [];

			for (i = 0; i < follower.length; i++) {
				user = { follower: follower[i].getFollowerInfo() };

				follower_id = user.follower.followed;
				let fuser = await db.User.findOne({
					where: {
						id: follower_id,
					},
				});

				profile = follower_id;
				let puser = await db.Profile.findOne({
					where: {
						UserId: profile,
					},
				});
				data.push([fuser.username, puser.ppic]);
			}
			return res.status(200).json(data);
		});
	});
});

router.get('/following/:user', auth.optional, (req, res, next) => {
	const {
		payload: { id },
	} = req;
	const {
		payload: { username },
	} = req;

	//finds username in database
	return db.User.findOne({
		where: {
			username: req.params.user,
		},
	}).then((user) => {
		//checks if the person accessing the file is the user
		if (!user) {
			return res.sendStatus(400);
		}
		//find all users that we follow
		db.Follower.findAll({
			where: { follower: user.id },
		}).then(async (follower) => {
			let data = [];

			for (i = 0; i < follower.length; i++) {
				user = { follower: follower[i].getFollowerInfo() };

				follower_id = user.follower.followed;
				let fuser = await db.User.findOne({
					where: {
						id: follower_id,
					},
				});

				profile = follower_id;
				let puser = await db.Profile.findOne({
					where: {
						UserId: profile,
					},
				});
				data.push([fuser.username, puser.ppic]);
			}
			return res.status(200).json(data);
		});
	});
});

router.get('/followers', auth.optional, (req, res, next) => {
	const {
		payload: { id },
	} = req;
	const {
		payload: { username },
	} = req;

	//finds username in database
	return db.User.findOne({
		where: {
			username: username,
		},
	}).then((user) => {
		//checks if the person accessing the file is the user
		if (!user) {
			return res.sendStatus(400);
		}
		//find all users that we follow
		db.Follower.findAll({
			where: { followed: id },
		}).then(async (followed) => {
			let data = [];

			for (i = 0; i < followed.length; i++) {
				user = { followed: followed[i].getFollowerInfo() };

				followed_id = user.followed.follower;
				let fuser = await db.User.findOne({
					where: {
						id: followed_id,
					},
				});

				profile = followed_id;
				let puser = await db.Profile.findOne({
					where: {
						UserId: profile,
					},
				});
				data.push([fuser.username, puser.ppic]);
			}
			return res.status(200).json(data);
		});
	});
});

router.get('/followers/:user', auth.optional, (req, res, next) => {
	const {
		payload: { id },
	} = req;
	const {
		payload: { username },
	} = req;

	//finds username in database
	return db.User.findOne({
		where: {
			username: req.params.user,
		},
	}).then((user) => {
		//checks if the person accessing the file is the user
		if (!user) {
			return res.sendStatus(400);
		}
		//find all users that we follow
		db.Follower.findAll({
			where: { followed: user.id },
		}).then(async (followed) => {
			let data = [];

			for (i = 0; i < followed.length; i++) {
				user = { followed: followed[i].getFollowerInfo() };

				followed_id = user.followed.follower;
				let fuser = await db.User.findOne({
					where: {
						id: followed_id,
					},
				});

				profile = followed_id;
				let puser = await db.Profile.findOne({
					where: {
						UserId: profile,
					},
				});
				data.push([fuser.username, puser.ppic]);
			}
			return res.status(200).json(data);
		});
	});
});

router.get('/profile/:user', auth.optional, (req, res, next) => {
	const {
		payload: { id },
	} = req;
	const {
		payload: { username },
	} = req;
	return db.User.findOne({
		where: {
			username: req.params.user,
		},
	}).then((user) => {
		if (!user) {
			return res.sendStatus(400);
		}
		var prof = { user: user.getUserInfo() };
		if (username == req.params.user) {
			prof.user['is_user'] = true;
		} else {
			prof.user['is_user'] = false;
		}
		db.Profile.findOne({
			where: { UserId: user.id },
		}).then((profile) => {
			for (let [key, value] of Object.entries(profile.getProfileInfo())) {
				prof.user[key] = value;
			}
			db.Follower.findOne({
				where: { follower: id, followed: user.id },
			}).then((follower) => {
				if (!follower) {
					prof.user['is_following'] = false;
					console.log(prof);
					return res.status(200).json(prof);
				} else {
					prof.user['is_following'] = true;
					console.log(prof);
					return res.status(200).json(prof);
				}
			});
		});
		//return res.status(200).json({ user: user.getProfileInfo() })
	});
});




router.get('/failure', (req, res, next) => {
	res.send('failure');
});

router.get('/logout', (req, res, next) => {
	req.logOut();
	res.cookie('authJWT', '', {
		httpOnly: true,
		maxAge: 0,
		signed: true,
	});
	return res.redirect('/');
});

function isLoggedIn(req, res, next) {
	//console.log(req)
	console.log(req.session);
	console.log(req._passport);
	if (req.isAuthenticated()) {
		return next();
	}
	return res.send('Not authenticated');
}
module.exports = router;
