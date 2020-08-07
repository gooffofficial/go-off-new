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
router.post('/', auth.optional, (req, res, next) => {
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
    if(!user.age){
        return res.status(422).json({
            errors: {
                age: 'is required',
            }
        })
    }
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
      password: user.password
    })
    .then((user) => {
      logger("User " + user.id + " created With username " + user.username);
      db.Profile.create({
        UserId: user.id 
      })
      .then(() => {
        {
          res.json({ user: user.getUserInfo() })
        }
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
      //console.log(passportUser);
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
router.post('/update', upload.single("file"), auth.required, (req, res, next) => {
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

router.get('/profile/:user', auth.optional, (req, res, next) => {
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
    db.Profile.findOne({
      where: { UserId: user.id }
    })
    .then((profile) => {
      for(let[key, value] of Object.entries(profile.getProfileInfo())){
        prof.user[key] = value
      }
      return res.status(200).json(prof);
    })
    //return res.status(200).json({ user: user.getProfileInfo() })
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
  return res.json({status: 'logged out'});
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

router.post('/testimage', upload.single("file"), (req, res, next) => {
  /*
  const file = req.body.imageUpload;
  const params = {
    Bucket: 'gooff',
    Key: 'images/'+file,
    ACL: 'public-read',
    Body: file
  };
  s3.upload(params, (err, data) => {
    if(err){
      console.log("Error: " +err);
    }
    else{
      console.log(data)
    }
    res.send(data.Location);
  })
  */
 res.redirect(req.file.location)
})
module.exports = router;