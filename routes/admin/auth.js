const express = require('express');
const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requirePasswordForUser } = require('../../routes/admin/validators');

const router = express.Router();

router.get('/signup', (req, res) => {
    res.send(signupTemplate({  req }));
  });
  
router.post('/signup', [requireEmail, requirePassword, requirePasswordConfirmation ], handleErrors(signupTemplate), async (req, res) => { 
    const { email, password, passwordConfirmation } = req.body;
  
    // Create a user in our user repo to represent this person
    const user = await usersRepo.create({ email,  password });
  
    // Store the id of that user inside of the user cookie 
    req.session.userId = user.id;
  
    res.redirect('/admin/products');
  });
  
router.get('/signout', (req, res) => {
     req.session = null;
     res.send('You are logged out');
  });
  
router.get('/signin', async (req, res) => {
     res.send(signinTemplate({}));
  });
  
router.post('/signin', [ requireEmailExists, requirePasswordForUser ], handleErrors(signinTemplate), async (req, res) => {
    const { email } = req.body;
  
    const user = await usersRepo.getOneBy({ email });
  
     req.session.userId = user.id;
  
     res.redirect('/admin/products');
  });
  

  module.exports = router;