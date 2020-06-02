const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
//const Users = require('models/Users');
const db = require('../../models')


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
    db.User.create({
      username: user.username,
      name: user.name,
      age: user.age,
      location: user.location,
      gender: user.gender,
      password: user.password
    })
    .then((user) => res.json({ user: user.toAuthJSON() }));
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
      if(passportUser) {
        const user = passportUser;
        user.token = passportUser.generateJWT();
        
        return res.json({ user: user.toAuthJSON() });
      }
  
      return status(400).info;
    })(req, res, next);
  });


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

      return res.json({ user: user.toAuthJSON() });
    });
})

router.get('/failure', (req, res, next) => {
  res.send('failure')
})
module.exports = router;