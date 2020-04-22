const express = require('express');
const router = express.Router();

//import userSchema
const User = require('../models/user');

//   ******* showing ejs file for user input  ********
router.get('/userInput', (req, res) => { 
    res.render('user');
});

// *************** getting all users from our database ****************
// infront of the arrow function we used "async" because we have to await the async method "User.find()"

router.get('/users', async (req, res) => { 
    // we wrap everything into try and catch. if there is an error we gonna catch the error and send the error message
    try{
        // we are trying to get all different user from our User model. If it's successful we will get att the users saved into our "users" variable
        const users = await User.find();
        // sending "users" variable as json to the client(whoever trying to get them from browser)
        res.json(users);
    }catch(err){
        // 500 status code means there are some kind of error in our server ( in database)
        res.status(500).json({ message: err.message })
    }

});

// ************** get one user from datbase based on the id ***************

//  As whenever a client wants to update/ delete / get an user by id, everytime we have to find the user using that Id first. So we have to write the same piece of code again and again . To do it efficient way we are going to create a function "getUser" that gonna work as a middleware
// this middleware function has req, res and next as a final property. Essentially all that the next function does is , if we call this at the end of our middleware function, move on to the next section of our code , what is  the callback function " async (req, res)=>{}) "

router.get('/users/:id', getUser, async (req, res) => { 
    // "/:id" this is parameter so we can access it using req.params
    res.json(res.user); // you can access the name like this => res.send(res.user.first_name)
});

//  *************** create a new user  *******************************
router.post('/users', async (req, res)=>{
    // we are creating a varible call user and set it equal to new User. So it's creating a new user using the "User" model / schema.
    const user = new User({
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        title : req.body.title,
        website : req.body.website
    })
    try{
        // "user.save()" going to  Persist the "user", we created above to our database Database and if it is successful then its going to be saved in the variable "newUser"
        const newUser = await user.save();
        // we are sending the client ('newUser') as json with a status code 201 to to let them know that the object was created successfully. If we dnt send a status code, a status code 200 will be send by default that means everything was successful. To be more specific we send status 201 when we using a "POST" route
        res.status(201).json(newUser);
    }catch(err){
        // if it was not successful that means there was an error in client side. They have send bad data. As all of our fields are set required in our UserSchema so if they don't fill out the form completely there will be an error. So we will send a status code 400 to let the them know there was an error in userinput 
        res.status(400).json( {message: err.message});
    }
    
})

//  ***************** Update an user info in Database ***************************

//  we use patch because we can update a single property of an user

router.patch('/users/:id', getUser, async (req, res)=>{
    // checking the request, if the client sending first_name to use we are taking that request and set that as the user's name property 
    if(req.body.first_name != null){
        res.user.first_name = req.body.first_name
    }
    if(req.body.last_name != null){
        res.user.last_name = req.body.last_name
    }
    if(req.body.title != null){
        res.user.title = req.body.title
    }
    if(req.body.website != null){
        res.user.website = req.body.website
    }
    try{
        // we are saving the changes in the database
        const updatedUser = await res.user.save();
        // sending back the updated user to the client
        res.json(updatedUser);
    }catch(err){
        res.status(400).json({message:err.message})
    }
})

//  *********************** Delete an user from Database **********************
router.delete('/users/:id', getUser, async(req, res)=>{
    try{
        // we have got user using the middleware getUser and remove is by writing
        await res.user.remove();
        // if successfully removed send the json back to the client
        res.json({message:"User Deleted"});
    }catch(err){

        res.status(500).json( {message: err.message});
    }
})

// we make this function async because we are accessiong 
async function getUser(req,res,next){
    let user;
    try{
        // in here we are trying to get our user based on that id
        user = await User.findById(req.params.id);
        //if we cant find the user we will send a status code 404. 404 mean we could not find anything
        if(user == null){
            // the reason we use return here because if there is no subscriber we will immediately leave the function and will not go any further
            return res.status(404).json({message:"Can't find User"})
        }
    }catch(err){
        // if error that means error caused in our server so sending 500 status
        return res.status(500).json({ message : err.message});
    }
    // we are creating a variable 'user' on the res(response) object and setting that equal to "user" what we found inside of "try". in this we can just call "res.user" in other function above what gonna be the "user" we set here
    res.user = user;
    next();
}

module.exports = router;