const express = require('express');
const router = express.Router();
const auth = require('./auth');
const db = require('../models');
const Room = require('../models/RoomSchema');
const DM = require('../models/DMSchema');
const crawler = require('../apify/crawler');
const sequelize = require('../sequelize');
const Sequelize = require('sequelize');
const path = require('path');

const seq = new Sequelize(
	'test_server1',
	process.env.RDS_USER,
	process.env.RDS_PASSWORD,
	{
		port: process.env.RDS_PORT,
		host: process.env.RDS_HOSTNAME,
		dialect: 'mysql',
		pool: {
			max: 10,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	}
);

router.use('/api', require('./api'));
router.use('/profiles', require('./profiles'));
router.use('/analytics', require('./analytics'));

// REACT
router.use(express.static(path.join(__dirname, '../client/build')));
router.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

router.get('/profile_edit', auth.required, async (req, res, next) => {
	const {
		payload: { username, id },
	} = req;
	let user = await db.User.findOne({
		where: {
			id: id,
		},
	});
	let host = user.host == '(Host)';
	let admin = user.admin == '(Admin)';
	console.log(host);
	console.log(admin);
	// res.render('profiles/profile_edit', {
	// 	user: username,
	// 	host: host,
	// 	admin: admin,
	// });
  res.json({
		user: username,
		host: host,
		admin: admin,
	});
});

router.get('/account_settings', auth.required, async (req, res, next) => {
	const {
		payload: { username, id },
	} = req;
	let user = await db.User.findOne({
		where: {
			id: id,
		},
	});
	let host = user.host == '(Host)';
	let admin = user.admin == '(Admin)';
	// res.render('profiles/account_settings', {
	// 	user: username,
	// 	host: host,
	// 	admin: admin,
	// });
  res.json({
    user: username,
		host: host,
		admin: admin,
  })

});

router.get('/followers', auth.required, (req, res, next) => {
	const {
		payload: { username },
	} = req;
	// res.render('profiles/followers', { user: username });
  res.json({ user: username })
});

router.get('/followers/:user', auth.required, (req, res, next) => {
	const {
		payload: { username },
	} = req;
	// res.render('profiles/followers', { user: req.params.user });
  res.json({ user: req.params.user });
});

router.get('/following', auth.required, (req, res, next) => {
	const {
		payload: { username },
	} = req;
	// res.render('profiles/following', { user: username });
  res.json({ user: username })
});

router.get('/following/:user', auth.required, (req, res, next) => {
	const {
		payload: { username },
	} = req;
	// res.render('profiles/following', { user: req.params.user });
  res.json({ user: req.params.user });
});

//Requesting Verification Code
router.get('/verify', (req, res) => {
	// res.render('emailver', { email: req.query.email });
  res.json({ email: req.query.email })
});

router.get('/feed', auth.optional, (req, res, next) => {
	const {
		payload: { id, username },
	} = req;
	//seq.query("SELECT article FROM test_server1.SavedArticles S, test_server1.Folders F, test_server1.Followers Fol WHERE Fol.follower = "+id+" AND F.id=S.FolderId")
	// Query to get first 4 articles from people who user is following
	// seq.query("SELECT article FROM test_server1.SavedArticles S, test_server1.Followers Fol WHERE Fol.follower = "+id+" AND Fol.followed=S.userId ORDER BY S.createdAt DESC LIMIT 4")

	seq
		.query(
			'SELECT article FROM test_server1.SavedArticles S ORDER BY S.createdAt DESC LIMIT 4'
		)
		.then(async (articles) => {
			var arts = [];
			for (var i = 0; i < articles[0].length; i++) {
				arts.push(articles[0][i].article);
			}
			console.log(arts);
			// console.log("TESTESTESTESTESTEST")
			var arts2 = [];
			for (const art of arts) {
				// For each article, find in the articles database, and add the image, title and url
				var art2 = {};
				console.log(art);
				let a = await db.Article.findOne({
					where: {
						url: art,
					},
				});
				if (!a) {
					art2['img'] = '';
					art2['title'] = '';
					art2['link'] = '';
				} else {
					art2['img'] = a.getArticleInfo()['img'];
					art2['title'] = a.getArticleInfo()['title'];
					art2['link'] = a.getArticleInfo()['url'];
				}

				let b = await db.SavedArticle.findOne({
					where: {
						article: art,
					},
				});
				if (!b) {
					art2['poster'] = '';
				} else {
					art2['poster'] = b.getFolderInfo()['userId'];
				}

				let c = await db.User.findOne({
					where: {
						id: art2['poster'],
					},
				});
				if (!c) {
					art2['user'] = '';
				} else {
					art2['user'] = c.getUserInfo()['username'];
				}
				console.log(art2);
				console.log('TESTESTESTESTESTEST');
				arts2.push(art2);
			}
			console.log(arts2.length);
			arts2 = arts2.reverse();
			if (arts2.length == 0) {
				let a = {
					img: '',
					title: '',
					link: '',
				};
				arts2.push(a);
				arts2.push(a);
				arts2.push(a);
				arts2.push(a);
			}
			// Check to make sure length is 4, and add dummy entries if not
			if (arts.length == 1) {
				let a = {
					img: '',
					title: '',
					link: '',
				};
				arts2.push(a);
				arts2.push(a);
				arts2.push(a);
			}
			if (arts.length == 2) {
				let a = {
					img: '',
					title: '',
					link: '',
				};
				arts2.push(a);
				arts2.push(a);
			}
			if (arts.length == 3) {
				let a = {
					img: '',
					title: '',
					link: '',
				};
				arts2.push(a);
			}
			// Query to find convos of people following
			// seq.query("SELECT ConvoId FROM test_server1.Convo_members C, test_server1.Followers Fol WHERE Fol.follower = "+id+" AND Fol.followed=C.UserId ORDER BY C.createdAt DESC LIMIT 4")
			seq
				.query(
					'SELECT ConvoId FROM test_server1.Convo_members C ORDER BY C.createdAt DESC LIMIT 4'
				)
				/*db.Convo_members.findAll({
            where: {
                UserId: id
            }
        })*/
				.then(async (convos) => {
					console.log('HOW MANY \n\n\n\n\n' + convos[0].length);
					var convs = [];
					var i = 0;
					// Add host, image, and title info for each convo
					for (const convo of convos[0]) {
						let c = await db.Convo.findOne({
							where: {
								id: convo.ConvoId,
							},
						});
						convs.push(c);
						let art = await db.Article.findOne({
							where: {
								url: c.article,
							},
						});
						let user = await db.User.findOne({
							where: {
								id: c.host,
							},
						});
						if (!user) {
							convs[i]['host'] = ' ';
						} else {
							convs[i]['host'] = user.username;
						}

						convs[i]['img'] = art.img;
						convs[i]['title'] = c.title;
						i++;
					}
					convs = convs.reverse();
					// Check length = 4 and add dummy entries if not
					if (convs.length == 0) {
						convs[0] = {
							article: '',
							id: -1,
						};
						convs[1] = {
							article: '',
							id: -1,
						};
						convs[2] = {
							article: '',
							id: -1,
						};
						convs[3] = {
							article: '',
							id: -1,
						};
					} else if (convs.length == 1) {
						convs[1] = {
							article: '',
							id: -1,
						};
						convs[2] = {
							article: '',
							id: -1,
						};
						convs[3] = {
							article: '',
							id: -1,
						};
					} else if (convs.length == 2) {
						convs[2] = {
							article: '',
							id: -1,
						};
						convs[3] = {
							article: '',
							id: -1,
						};
					} else if (convs.length == 3) {
						convs[3] = {
							article: '',
							id: -1,
						};
					}
					//console.log(convs[0].article)
					//console.log(arts2[1].article + "AHAFJHSD;KJFGPAWUEHFBKSDJFGWPEUIFHSDJHFBGWEIURHFSDVGLSIDUBS\N\N\N\N\N\N\N\N\N\N\N")
					let user = await db.User.findOne({
						where: {
							id: id,
						},
					});
					let host = user.host == '(Host)';
					let admin = user.admin == '(Admin)';

					let user1 = await db.Profile.findOne({
						where: {
							UserId: id,
						},
					});
					let ppic = user1.ppic;
					// res.render('feed', {
					// 	myuser: username,
					// 	user: req.params.user,
					// 	ppic: ppic,
					// 	articles: arts2,
					// 	convos: convs,
					// 	host: host,
					// 	admin: admin,
					// });
          res.json({
						myuser: username,
						user: req.params.user,
						ppic: ppic,
						articles: arts2,
						convos: convs,
						host: host,
						admin: admin,
					});
				});
		});
});

// router.get('/feed/:username', auth.required, (req, res, next) => {
//     const { payload: { id, username } } = req;
//     console.log("I AM IN The FEED")
//     sequelize.query("SELECT * FROM test_server1.SavedArticles S, test_server1.Folders F, test_server1.Followers Fol WHERE Fol.follower = "+id+" AND F.id=S.FolderId")
//     .then((articles) => {
//         console.log("THEEEESE ARE THE ARTICLES: "+ articles)
//         res.render('feed', {user: req.params.user})
//     })
// })

router.get('/conversation', auth.optional, (req, res, next) => {
	const {
		payload: { username, id },
	} = req;
	var article = req.query['article'];
	//picture, title, author, link
	db.Article.findOne({
		where: {
			url: article,
		},
	}).then((art) => {
		// if article not found, scrape and add to databse. Reload page
		if (!art) {
			try {
				crawler(req.query['article']);
			} catch (err) {
				return res.send(err);
			}
			return res.redirect(
				'/conversation/article?article=' + req.query['article']
			);
		}
		db.Convo.findAll({
			limit: 2,
			where: {
				article: article,
			},
			//order by convo date
			order: [['time', 'ASC']],
		}).then(async (convos) => {
			var hosts = [];
			// Add host username for each convo
			for (const convo of convos) {
				let host = await db.User.findOne({
					where: {
						id: convo.host,
					},
				});
				hosts.push(host.username);
			}
			// Verify length and add dummy entries if not right
			if (hosts.length == 0) {
				hosts[0] = '';
				hosts[1] = '';
			} else if (hosts.length == 1) {
				hosts[1] = '';
			}
			if (convos.length == 0) {
				convos[0] = {
					time: 'No convo scheduled',
					id: -1,
					description: 'Description',
					title: 'Title',
				};
				convos[1] = {
					time: 'No convo scheduled',
					id: -1,
					description: 'Description',
					title: 'Title',
				};
			} else if (convos.length == 1) {
				convos[1] = {
					time: 'No convo scheduled',
					id: -1,
					description: 'Description',
					title: 'Title',
				};
			}
			let ts = Date.now();
			let date_ob = new Date(ts);
			let date = date_ob.getDate();
			let month = date_ob.getMonth() + 1;
			let year = date_ob.getFullYear();
			let user = await db.User.findOne({
				where: {
					id: id,
				},
			});
			// Ensure user is host or admin
			let host = user.host == '(Host)';
			let admin = user.admin == '(Admin)';
			// return res.render('conversation', {
			// 	user: username,
			// 	articlePic: art.img,
			// 	artTitle: art.title,
			// 	artLink: article,
			// 	date: year + '-' + month + '-' + date + 'T00:00',
			// 	convos: convos,
			// 	hosts: hosts,
			// 	host: host,
			// 	admin: admin,
			// });
      return res.json({
				user: username,
				articlePic: art.img,
				artTitle: art.title,
				artLink: article,
				date: year + '-' + month + '-' + date + 'T00:00',
				convos: convos,
				hosts: hosts,
				host: host,
				admin: admin,
			});
		});
	});
});

router.get('/folder/:id', auth.required, (req, res, next) => {
	const {
		payload: { username },
	} = req;

	db.SavedArticle.findAll({
		where: {
			FolderId: req.params.id,
		},
	}).then((articles) => {
		var save = [];
		if (articles.length == 0) {
			console.log('ENTERED ERRORORR MOODE');
			return res.status(422).json({
				errors: {
					article: 'not found',
				},
			});
		} else {
			for (var i = 0; i < articles.length; i++) {
				save.push(articles[i].getFolderInfo());
			}
			console.log(articles);
			// res.render('profiles/folder', { articles: save });
      res.json({ articles: save });
		}
	});
});

//route to get into direct messages
router.get('/m/:username', auth.required, (req, res, next) => {
	const {
		payload: { username, id },
	} = req;
	db.User.findOne({
		where: {
			username: req.params.username,
		},
	}).then(async (user) => {
		if (!user) {
			return res.json({ err: 'User not found' });
		}
		var profile = await db.Profile.findOne({
			where: {
				userId: user.id,
			},
		});
		var userPic = profile.ppic;
		var users = [req.params.username, username];
		users.sort();
		// Find the room of the dms between users via room identifier (usernames concatenated in alphabetical order)
		var roomIdentifier = users[0] + users[1];
		DM.findOne({ identifier: roomIdentifier }, (err, room) => {
			if (err) {
				console.log(err);
			}
			var lastMessages = [];
			DM.find({ users: id })
				.populate('messages')
				.then(async (dms, err) => {
					if (err) {
						console.log(err);
					}
					//Get the last messages from all dm conversations
					console.log(dms, '\n\n\n\n\n');
					for (let i = 0; i < dms.length; i++) {
						for (let k = 0; k < dms[i].users.length; k++) {
							if (dms[i].users[k] != id) {
								lastMessages.push([
									dms[i].users[k],
									dms[i].messages[dms[i].messages.length - 1].message,
								]);
							}
						}
					}
					//Get the username for all dm conversations
					//TODO: Optimize query for users
					for (let i = 0; i < lastMessages.length; i++) {
						let user = await db.User.findOne({
							where: {
								id: lastMessages[i][0],
							},
						});
						let profile = await db.Profile.findOne({
							where: {
								userId: lastMessages[i][0],
							},
						});
						if (!user || !profile) {
							lastMessages[i][0] = null;
							lastMessages[i][1] = null;
							lastMessages[i][2] = null;
						}
						lastMessages[i][0] = user.username;
						lastMessages[i].push(profile.ppic);
					}
					// res.render('dm', {
					// 	user: username,
					// 	admin: true,
					// 	id: req.params.username,
					// 	status: false,
					// 	title: req.params.username,
					// 	url: '/profiles/' + req.params.username,
					// 	js: 'dm.js',
					// 	lastMessages: lastMessages,
					// 	userPic: userPic,
					// });
          res.json({
						user: username,
						admin: true,
						id: req.params.username,
						status: false,
						title: req.params.username,
						url: '/profiles/' + req.params.username,
						js: 'dm.js',
						lastMessages: lastMessages,
						userPic: userPic,
					});
				});
		});
	});
});

//route to get into individual chatrooms
router.get('/chat/:roomid', auth.required, (req, res, next) => {
	const {
		payload: { id },
	} = req;
	Room.findById(req.params.roomid, (err, room) => {
		if (err) {
			console.log(err);
			return res.send(err);
		}
		db.Article.findOne({
			where: {
				url: room.url[0],
			},
		}).then((article) => {
			// If article not in database, scrape and add
			if (!article) {
				try {
					crawler(room.url[0]);
				} catch (err) {
					return res.send(err);
				}
				return res.redirect('/chat/' + req.params.roomid);
			}
			db.User.findOne({
				where: {
					id: id,
				},
			}).then(async (user) => {
				var convo = await db.Convo.findOne({
					where: {
						RoomId: req.params.roomid,
					},
				});

				//Check to see whether the conversation has started yet
				var convoStarted = false;
				var curTime = Date.now();
				var convoTime = convo.time;
				if (curTime >= convoTime) {
					convoStarted = true;
				}
				var convoHost = id == convo.host;
				var title = convo.title;
				var desc = convo.description;
				db.User.findOne({
					where: {
						id: convo.host,
					},
				}).then((hoster) => {
					var hosting = hoster.name;
					if (title.length > 30) {
						title = title.substring(0, 30);
					}
					if (user.admin != '(Admin)' && user.host != '(Host)') {
						// return res.render('index', {
						// 	user: user.username,
						// 	admin: false,
						// 	host: false,
						// 	id: req.params.roomid,
						// 	status: room.status,
						// 	title: title,
						// 	hosting: hosting,
						// 	desc: desc,
						// 	url: article.url,
						// 	convoHost: convoHost,
						// 	convoStarted: convoStarted,
						// 	js: 'index.js',
						// });
            return res.json({
							user: user.username,
							admin: false,
							host: false,
							id: req.params.roomid,
							status: room.status,
							title: title,
							hosting: hosting,
							desc: desc,
							url: article.url,
							convoHost: convoHost,
							convoStarted: convoStarted,
							js: 'index.js',
						});
					} else {
						// return res.render('index', {
						// 	user: user.username,
						// 	admin: true,
						// 	host: true,
						// 	id: req.params.roomid,
						// 	status: room.status,
						// 	title: title,
						// 	hosting: hosting,
						// 	desc: desc,
						// 	url: article.url,
						// 	convoHost: convoHost,
						// 	convoStarted: convoStarted,
						// 	js: 'index.js',
						// });
            return res.json({
							user: user.username,
							admin: true,
							host: true,
							id: req.params.roomid,
							status: room.status,
							title: title,
							hosting: hosting,
							desc: desc,
							url: article.url,
							convoHost: convoHost,
							convoStarted: convoStarted,
							js: 'index.js',
						});
					}
				});
			});
		});
	});
});

router.get('/usertype', auth.optional, (req, res, next) => {
	// res.render('usertype');
  res.json({ 'usertype': 'usertype'})
});

router.get('/login', auth.optional, (req, res, next) => {
	// send extra parameter so that if the parameter isnt there, just send to main page
	// if parameter is there, we send them to that link after login
	// can send to redirectlogin where login button goes to parameter sent with it
	//let invitable = req.params.invitableLink;
	//console.log(invitable)
	// without slash goes to relative url following /login

	// 'login?article=/conversation/?article=https://nypost.com/2021/04/01/pfizer-says-vaccine-lasts-six-months-protects-against-variants/?utm_campaign=iphone_nyp&utm_source=message_app'

	let myConversation = req.query['convo'];
	if (myConversation === undefined) {
		console.log('test');
		// res.render('login', { redirectLink: 'noRedirect' });
    res.json({ redirectLink: 'noRedirect' });
	} else {
		console.log(myConversation);
		// if default login jsut snd them to login page
    // res.render('login', { redirectLink: myConversation });
		res.json({ redirectLink: myConversation });
	}

	/*
    
    if (invitable === 'default') {
        res.render('login', { redirectLink: 'noRedirect' });
    } else {
        res.render('login', { redirectLink: req.params.invite });
    } */
	// login page has a post request in the signup form. see if login is invitable link. if it isnt just send them to regular login page.
	// if it is, send them to redirect login.
	// line 23 of splash.ejs is what we need to change. send them to 'login/nonInvite' or just check if invitable is ''
});

router.get('/signup', auth.optional, (req, res, next) => {
	// res.render('signup');
  res.json({ signup: 'signup'});
});

router.get('/comp_profile', auth.optional, (req, res, next) => {
	// res.render('comp_profile');
  res.json({ comp_profile: 'comp_profile' });
});

router.get('/ver_account', auth.optional, (req, res, next) => {
	// res.render('ver_account');
  res.json({ ver_account: 'ver_account' });
});

module.exports = router;
