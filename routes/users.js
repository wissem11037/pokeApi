var express=require('express');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
var router=express.Router();
function ByEncrpyt(password) {
    bcrypt.genSalt(10, function(err, Salt) {
        bcrypt.hash(password, Salt, function(err, hash) {
            if (err) {
                return console.log('Cannot encrypt');
            }
            hashedPassword = hash;
            return hashedPassword;
        })
    })
}
async function ByCompare(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

router.post('/signup', async function(req, res, next) {
        let exists = await User.exists({nom:req.body.username});
        console.log(exists);
        if (!exists) {
           
            const user = new User({
                nom:req.body.username,
                mdp:req.body.password,
                pokemon:[]});
                const newUser = await user.save();
                console.log("User Created");
                res.status(201).json(newUser)
            
            /*let token = jwt.sign({
                data: req.body.username
            }, 'secret');
            res.send({
                status: 1,
                token: token
            });*/
        } else {
            console.log("User Already Exists");
            res.send({
                status: 0,
                error: 'user exists'
            });
        }  
});
router.post('/signin', async function(req, res, next) {
    
        let exists = await User.exists({nom:req.body.username});
        if (exists) {
            const user = await User.find({nom: username})
           // const hashed_password = ByEncrpyt(password.toString());
            if (user.mdp===req.body.password) {
                let token = jwt.sign({
                    data: req.body.username
                }, 'secret');
                res.send({
                    status: 1,
                    data: req.body.username,
                    token: token
                });
            } else {
                console.log("Wrong Password");
                res.send({
                    status: 0,
                    error: error
                });
            }
        } else {
            console.log("No User Find");
            res.send({
                status: 0,
                error: error
            });
        }
    
});
router.get('/equipe/:id',async function(req,res){
    try {
        const users = await User.find({'_id': req.params.id})
        res.json(users)
        console.log("request 200 complete")
      } catch (err) {
        res.status(500).json({ message: err.message })
      }
});
router.put('/addPokemon/:id',async function(req,res){
    try {
        await User.findByIdAndUpdate(req.params.id, {
         $set:{
             pokemons:req.body.pokemons,
         }
    
        });
        // Send response in here
        res.send('pokemon ajouté!');
  
      } catch(err) {
          console.error(err.message);
         
      }
  });
router.put('/removePokemon/:id',async function(req,res){
     try {
        await User.findByIdAndUpdate(req.params.id, {
         $set:{
             pokemons:req.body.pokemons,
         }
    
        });
        // Send response in here
        res.send('pokemon supprimée!');
  
      } catch(err) {
          console.error(err.message);
         
      }
  });

module.exports=router;