const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');


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
    if(!user.firstName){
        return res.status(422).json({
            errors: {
                firstName: 'is required',
            }
        })
    }
    if(!user.lastName){
        return res.status(422).json({
            errors: {
                lastName: 'is required',
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
    if(!user.email){
        return res.status(422).json({
            errors: {
                email: 'is required',
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
    const finalUser = new Users(user);
    finalUser.setPassword(user.password);

    return finalUser.save()
    .then(() => res.json({ user: finalUser.toAuthJSON() }));
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
  
    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
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
    const { payload: { _id } } = req;
    //console.log(req);
    return Users.findById(_id)
    .then((user) => {
      if(!user) {
        return res.sendStatus(400);
      }

      return res.json({ user: user.toAuthJSON() });
    });
})

module.exports = router;