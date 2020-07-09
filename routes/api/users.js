const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
//const Users = require('models/Users');
const db = require('../../models')
const logger = require('../../logger')
const _ = require('lodash')


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
    if(!user.name){
        return res.status(422).json({
            errors: {
                name: 'is required',
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
      name: user.name,
      email: user.email,
      age: user.age,
      location: user.location,
      gender: user.gender,
      password: user.password
    })
    .then((user) => {
      logger("User " + user.id + " created With username " + user.username);
      res.json({ user: user.getUserInfo() })
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
        return res.json({ user: user.toAuthJSON() });
      }
  
      return res.sendStatus(400).info;
    })(req, res, next);
  });

//POST for updating user info
router.post('/update', auth.required, (req, res, next) => {
  const { payload: { id } } = req;
  let request = {
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    age: req.body.age,
    location: req.body.location,
    gender: req.body.gender,
    password: req.body.password
  }
  //console.log(req.payload)
  request = _.pickBy(request, _.identity); // <--- Will remove empty | null | undefined
  for(var key in request){
    if(key == "password"){
      logger("User " + id + " updated their password");
    }
    else{
      logger("User " + id + " updated their " + key + " from " + req.payload[key] + " to " + request[key]);
    }
  }
  return db.User.update(request, {
    where: {
      id: id
    },
    individualHooks: true
  }).then(() => {
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
      return res.json(user.getUserInfo());
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
  return db.user.findOne({
    where: {
      username: req.params.user
    }
  })
  .then((user) => {
    if(!user) {
      return res.sendStatus(400);
    }
    return res.status(200).json({ user: user.getProfile() })
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
module.exports = router;