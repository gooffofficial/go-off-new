const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
//const Users = require('models/Users');
const db = require('../../models')
const logger = require('../../logger')
const _ = require('lodash')
const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const { body } = require('express-validator');
const crawler = require('../../apify/crawler')

AWS.config.update({
  region: "us-east-1"
});

const s3 = new AWS.S3();

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg") {
    cb(null, true);
  } 
  else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3: s3,
    bucket: 'gooff',
    metadata: function(req, file, cb){
      cb(null, {fieldName: "TESTING_METADATA"});
    },
    key: function(req, file, cb){
      cb(null, 'images/'+Date.now()+file.originalname);
    }
  }),
  limits: {fileSize: 1024*1024}
})
//POST for new user registration
router.post('/', auth.optional, [
  body('username').escape(),
  body('email').escape(),
  body('firstname').escape(),
  body('lastname').escape(),
  body('age').escape(),
  body('location').escape(),
  body('gender').escape(),
  body('password').escape(),
  body('birthdate').escape()
],(req, res, next) => {
    //const { body: { user } } = req;
    //console.log(req);
    const user = req.body;
    if(!user.username){
        return res.status(422).json({
            errors: {
                username: 'is required',
            }
        })
    }
    if(!user.email){
      return res.status(422).json({
        errors: {
          email: 'is required',
        }
      })
    }
    if(!user.firstname){
        return res.status(422).json({
            errors: {
                firstname: 'is required',
            }
        })
    }
    if(!user.lastname){
      return res.status(422).json({
        errors:{
          lastname: "is required",
        }
      })
    }
    /*
    if(!user.age){
        return res.status(422).json({
            errors: {
                age: 'is required',
            }
        })
    }*/
    if(!user.location){
        return res.status(422).json({
            errors: {
                location: 'is required',
            }
        })
    }
    if(!user.gender){
        return res.status(422).json({
            errors: {
                gender: 'is required',
            }
        })
    }
    if(!user.password){
        return res.status(422).json({
            errors: {
                password: 'is required',
            }
        })
    }
    if(!user.birthdate){
      return res.status(422).json({
        errors: {
          birthdate: 'is required',
        }
      })
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
    db.User.create({
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
      name: user.firstname+' '+user.lastname,
      email: user.email,
      age: user.age,
      location: user.location,
      gender: user.gender,
      password: user.password,
      admin: user.admin,
      birthdate: user.birthdate,
      user_ver: 0,
      followercount: user.followercount,
      followingcount: user.followingcount,
    })
    .then((user) => {
      logger("User " + user.id + " created With username " + user.username);
      db.Profile.create({
        UserId: user.id 
      })
      .then(() => {
        db.UserArticle.create({
          UserId: user.id
        })
        .then(() => 
        {
          res.redirect('/login');
        })
      })
    })
    .catch((err) => {
      res.json({"error": err.errors[0].message});
    });
});

//POST for user login
router.post('/login', auth.optional, (req, res, next) => {
    //const { body: { user } } = req.body;
    const user = req.body;
    
    if(!user.username) {
      return res.status(422).json({
        errors: {
          username: 'is required',
        },
      });
    }
  
    if(!user.password) {
      return res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }
    return passport.authenticate('local', (err, passportUser, info) => {
      if(err) {
        return next(err);
      }
      // console.log(passportUser);
      if(passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();
        res.cookie('authJWT', user.toAuthJSON().token, {
          httpOnly: true,
          signed: true,
        })
        return res.redirect('/profiles/'+passportUser.username);
      }
  
      return res.sendStatus(400).info;
    })(req, res, next);
  });

//POST for updating user info
router.post('/update', upload.single("file"), auth.required, [
  body('username').escape(),
  body('email').escape(),
  body('firsname').escape(),
  body('lastname').escape(),
  body('age').escape(),
  body('location').escape(),
  body('gender').escape(),
  body('password').escape(),
  body('bio').escape()
],(req, res, next) => {
  const { payload: { id } } = req;
  let request = {
    username: req.body.username,
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    age: req.body.age,
    location: req.body.location,
    gender: req.body.gender,
    password: req.body.password,
    bio: req.body.bio,
    followercount: req.body.followercount,
    followingcount: req.body.followingcount,
  }
  //check if first or last name was filled out in the form
  if(req.body.firstname != '' || req.body.lastname != ''){
    request.name = req.body.firstname + ' ' + req.body.lastname;
  }
  //Check if file was submitted
  if(req.file){
    request.ppic = req.file.location
  }

  requestfin = _.pickBy(request, _.identity); // <--- Will remove empty | null | undefined
  //logging updates
  for(var key in requestfin){
    if(key == "password"){
      logger("User " + id + " updated their password");
    }
    else{
      logger("User " + id + " updated their " + key + " from " + req.payload[key] + " to " + request[key]);
    }
  }
  return db.User.update(requestfin, {
    where: {
      id: id
    },
    individualHooks: true
  })
  .then(() => {
    db.Profile.update(requestfin, {
      where: {
        userId: id
      }
    })
  })
  .then(() => {
    db.User.findOne({
      where: {
        id: id
      }
    }).then((user) => {
      if(!user){
        return res.sendStatus(400);
      }
      user.token = user.generateJWT();
      res.cookie('authJWT', user.toAuthJSON().token, {
        httpOnly: true,
        signed: true
      })
      return res.redirect("/profiles/"+user.username);
    })
  })
})

router.post('/follower_update', auth.required, (req, res, next) => {
  //id of logged in user
  const { payload: { id } } = req;

  var username = req.body.username;

  //find username in db
  return db.User.findOne({
    where: {
      username: username
    }
  })
  .then((user) => {
    if(!user) {
      return res.sendStatus(400);
    }
    var prof = {user: user.getUserInfo()};
    
    db.Follower.findOne({
      where: { follower: id, followed: user.id} 
    })
    .then((follower) => {
      if (!follower ){
        prof.user["is_following"] = false

        db.Follower.create({
          follower: id,
          followed: user.id
        })
        db.User.increment({
          followingcount: +1
        },
        {
            where:
            {
                id: id
            }
        })
        db.User.increment({
          followercount: +1
        },
        {
            where:
            {
                username: username
            }
        })
        return res.redirect('/profiles/'+username);
      }else{

        db.Follower.destroy({
          where:{
            follower: id,
          followed: user.id
          }
        })
        db.User.increment({
          followingcount: -1
        },
        {
            where:
            {
                id: id
            }
        })
        db.User.increment({
          followercount: -1
        },
        {
            where:
            {
                username: username
            }
        })
        return res.redirect('/profiles/'+username);
        
        return res.status(200).json(prof);
      }
    })  
      
    
  })
})

router.get('/all', auth.required, (req, res, next) => {
  return db.User.findAll({
    attributes: ['username','name']
  })
  .then((users) => {
    //return res.json(JSON.stringify(users));
    return res.json(users);
  })
})

//GET authenticated user
router.get('/current', auth.required, (req, res, next) => {
    const { payload: { username } } = req;
    return db.User.findOne({
      where: {
        username: username
      }
    })
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }
      return res.status(200).json({ user: user.getUserInfo() });
    });
})

router.get('/following', auth.optional, (req, res, next) => {
  const {payload: {id}} = req;
  const {payload: {username}} = req;

  //finds username in database
  return db.User.findOne({
    where: {
      username: username
    }
  })

  .then((user) => {
    //checks if the person accessing the file is the user
    if(!user) {
      return res.sendStatus(400);
    }
    //find all users that we follow
    db.Follower.findAll({
      where: { follower: id} 
    })
    .then(async(follower) => {
      
      let data = [];
      
      for(i = 0; i < follower.length; i++){
        user = ({ follower: follower[i].getFollowerInfo() });
        
        follower_id = user.follower.followed;
        let fuser = await db.User.findOne({
          where: {
            id: follower_id
          }
        })
        
        profile = follower_id;
        let puser = await db.Profile.findOne({
          where: {
            UserId: profile
          }
        })
        data.push([fuser.username, puser.ppic]);
      }
      return res.status(200).json(data);
    })
  })
}) 

router.get('/following/:user', auth.optional, (req, res, next) => {
  const {payload: {id}} = req;
  const {payload: {username}} = req;

  //finds username in database
  return db.User.findOne({
    where: {
      username: req.params.user
    }
  })

  .then((user) => {
    //checks if the person accessing the file is the user
    if(!user) {
      return res.sendStatus(400);
    }
    //find all users that we follow
    db.Follower.findAll({
      where: { follower: user.id} 
    })
    .then(async(follower) => {
      
      let data = [];
      
      for(i = 0; i < follower.length; i++){
        user = ({ follower: follower[i].getFollowerInfo() });
        
        follower_id = user.follower.followed;
        let fuser = await db.User.findOne({
          where: {
            id: follower_id
          }
        })
        
        profile = follower_id;
        let puser = await db.Profile.findOne({
          where: {
            UserId: profile
          }
        })
        data.push([fuser.username, puser.ppic]);
      }
      return res.status(200).json(data);
    })
  })
}) 

router.get('/profile/:user', auth.optional, (req, res, next) => {
  const {payload: {id}} = req;
  const {payload: {username}} = req;
  return db.User.findOne({
    where: {
      username: req.params.user
    }
  })
  .then((user) => {
    if(!user) {
      return res.sendStatus(400);
    }
    var prof = {user: user.getUserInfo()};
    if(username == req.params.user){
      prof.user["is_user"] = true
    }else{
      prof.user["is_user"] = false
    }
    db.Profile.findOne({
      where: { UserId: user.id }
    })
    .then((profile) => {
      for(let[key, value] of Object.entries(profile.getProfileInfo())){
        prof.user[key] = value
      }
      db.Follower.findOne({
        where: { follower: id, followed: user.id} 
      })
      .then((follower) => {
        if (!follower ){
          prof.user["is_following"] = false
          console.log(prof)
          return res.status(200).json(prof);
        }else{
          prof.user["is_following"] = true
          console.log(prof)
          return res.status(200).json(prof);
        }
      })
    })
    //return res.status(200).json({ user: user.getProfileInfo() })
  })
})

router.get('/articles/:user', auth.optional, (req, res, next) => {
  return db.User.findOne({
    where: {
      username: req.params.user
    }
  }).then((user) => {
    if(!user){
      return res.sendStatus(400);
    }
    db.UserArticle.findOne({
      where: {
        UserId: user.id
      }
    })
    .then((userArts) => {
      if (!userArts){
        return res.status(200).json({
          article1Url: "",
          article1Title: "No article added",
          article1Readtime: "",
          article1img: "/Plus.png",
          article2Url: "",
          article2Title: "No article added",
          article2Readtime: "",
          article2img: "/Plus.png",
          article3Url: "",
          article3Title: "No article added",
          article3Readtime: "",
          article3img: "/Plus.png" , 
          article4Url: "",
          article4Title: "No article added",
          article4Readtime: "",
          article4img: "/Plus.png"   
        })
      }
      var articleLinks = userArts.getArticles();
      var articles = {};
      db.Article.findOne({
        where: {
          url: articleLinks["article1"]
        }
      }).then((article1) => {
        if(!article1){
          articles["article1Url"] = "";
          articles["article1Title"] = "No article added";
          articles["article1Readtime"] = "";
          articles["article1img"] = "/Plus.png";
        }
        else{
          var article1Info = article1.getArticleInfo();
          articles["article1Url"] = article1Info["url"];
          articles["article1Title"] = article1Info["title"];
          articles["article1Readtime"] = article1Info["readTime"]
          articles["article1img"] = article1Info["img"];
        }
        db.Article.findOne({
          where: {
            url: articleLinks["article2"]
          }
        }).then((article2) => {
        if (!article2){
          articles["article2Url"] = "";
          articles["article2Title"] = "No article added";
          articles["article2Readtime"] = "";
          articles["article2img"] = "/Plus.png";
        }
        else{
          var article2Info = article2.getArticleInfo();
          articles["article2Url"] = article2Info["url"];
          articles["article2Title"] = article2Info["title"];
          articles["article2Readtime"] = article2Info["readTime"]
          articles["article2img"] = article2Info["img"];
        }
        db.Article.findOne({
          where: {
            url: articleLinks["article3"]
          }
        }).then((article3) => {
        if(!article3){
          articles["article3Url"] = "";
          articles["article3Title"] = "No article added";
          articles["article3Readtime"] = "";
          articles["article3img"] = "/Plus.png";
        }
        else{
          var article3Info = article3.getArticleInfo();
          articles["article3Url"] = article3Info["url"];
          articles["article3Title"] = article3Info["title"];
          articles["article3Readtime"] = article3Info["readTime"]
          articles["article3img"] = article3Info["img"];
        }
        db.Article.findOne({
          where: {
            url: articleLinks["article4"]
          }
        }).then((article4) => {
          if(!article4){
            articles["article4Url"] = "";
            articles["article4Title"] = "No article added";
            articles["article4Readtime"] = "";
            articles["article4img"] = "/Plus.png";
          }
          else{
            var article4Info = article4.getArticleInfo();
            articles["article4Url"] = article4Info["url"];
            articles["article4Title"] = article4Info["title"];
            articles["article4Readtime"] = article4Info["readTime"]
            articles["article4img"] = article4Info["img"];
          }
        return res.status(200).json(articles);
        })
        })
      })
      })
    })
  })
})

router.get('/failure', (req, res, next) => {
  res.send('failure')
})

router.get('/logout', (req, res, next) => {
  req.logOut();
  res.cookie('authJWT', '',{
    httpOnly: true,
    maxAge: 0,
    signed: true
  })
  return res.redirect('/');
})


// add articles for user
router.post('/add_article', auth.required, [body('userArticle').blacklist('<>')], (req, res, next) => {
  const { payload: {id, username} } = req;
  db.Article.findOne({
    where: {
      url: req.body.userArticle
    }
  }).then((art) => {
    if (!art){
      try {
        crawler(req.body.userArticle)
      }
      catch(err){
        return res.send(err)
      }
    }
    db.UserArticle.findOne({
      where: {
        userId: id
      }
    }).then((userArticle) => {
      if(!userArticle){
          db.UserArticle.create({
            UserId: id,
            article1: req.body.userArticle
        })
      }
      else{
        var articles = userArticle.getArticles()
        db.UserArticle.update({
          article4: articles.article3,
          article3: articles.article2,
          article2: articles.article1,
          article1: req.body.userArticle
        },
        {
          where: {
            userId: id
          }
        })
      }
    })
    return res.redirect('/profiles/'+username);
  })
})

//move to users.js file
router.post('/add_article1', auth.required,[
  body('article').escape()
], (req, res, next) => {
  const { payload: { id, username } } = req;
  db.Article.findOne({
      where: {
          url: req.body.article
      }
  }).then((art) => {
      if(!art){
          try{
              crawler(req.body.article)
          }
          catch(err){
              return res.send(err);
          }
          //return res.json({
          //    "created": true
          //})
      }
      db.UserArticle.findOne({
          where: {
              UserId: id
          }
      }).then((userArticle) => {
          if(!userArticle){
              db.UserArticle.create({
                  UserId: id,
                  article1: req.body.article
              })
          }
          else{
              db.UserArticle.update({
                  article1: req.body.article
              },
              {
                  where:
                  {
                      userId: id
                  }
              })
          }
      })
      return res.redirect('/profiles/'+username);
  })
})

//move to users.js file
router.post('/add_article2', auth.required, [
  body('article').escape()
],(req, res, next) => {
  const { payload: { id, username } } = req;
  db.Article.findOne({
      where: {
          url: req.body.article
      }
  }).then((art) => {
    console.log(art)
      if(!art){
          try{
              crawler(req.body.article)
          }
          catch(err){
              return res.send(err);
          }
          //return res.json({
          //    "created": true
          //})
      }
      db.UserArticle.findOne({
          where: {
              UserId: id
          }
      }).then((userArticle) => {
          if(!userArticle){
              db.UserArticle.create({
                  UserId: id,
                  article2: req.body.article
              })
          }
          else{
              db.UserArticle.update({
                  article2: req.body.article
              },
              {
                  where:
                  {
                      userId: id
                  }
              })
          }
      })
      return res.redirect('/profiles/'+username);
  })
})

//move to users.js file
router.post('/add_article3', auth.required, [
  body('userArticle').blacklist('<>')
],(req, res, next) => {
  const { payload: { id, username } } = req;
  db.Article.findOne({
      where: {
          url: req.body.article
      }
  }).then((art) => {
      if(!art){
          try{
              crawler(req.body.article)
          }
          catch(err){
              return res.send(err);
          }
          //return res.json({
          //    "created": true
          //})
      }
      db.UserArticle.findOne({
          where: {
              UserId: id
          }
      }).then((userArticle) => {
          if(!userArticle){
              db.UserArticle.create({
                  UserId: id,
                  article3: req.body.article
              })
          }
          else{
              db.UserArticle.update({
                  article3: req.body.article
              },
              {
                  where:
                  {
                      userId: id
                  }
              })
          }
      })
      return res.redirect('/profiles/'+username);
  })
})

router.post('/saveto_folder', auth.required, [], (req, res, next) =>{
  const { payload: { id, username } } = req; 
  db.Folder.findOne({
    where: {
      foldername: req.body.folder,
      UserId: id
    }
  }).then((folder) => {
      if(!folder){
        return res.status(422).json({
          errors: {
            folder: "does not exist"
          }
        });
      }
      db.SavedArticle.findAll({
        where: {
          FolderId: folder.id
        }
      }).then((articles) => {
        for(i = 0; i < articles.length; i++){
          if(articles[i].article==req.body.userArticle){
            return res.status(200)
          }
        }
        db.SavedArticle.create({
          FolderId: folder.id,
          article: req.body.userArticle
        }).then(() =>{
          return res.sendStatus(200)
        })
      })
  })
  })
function isLoggedIn(req, res, next){
  //console.log(req)
  console.log(req.session);
  console.log(req._passport);
  if(req.isAuthenticated()){
    return next();
  }
  return res.send("Not authenticated")
}
module.exports = router;