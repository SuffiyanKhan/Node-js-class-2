import express from 'express';
import Auth from '../modules/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Joi from 'joi';
const router = express.Router();

const userShema = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().required().min(8)
})

router.delete('/:id' , async (req , res) => {
    //  await Auth.deleteOne({ _id : req.params.id})
    await Auth.deleteOne({ _id : req.params.id})
     res.status(200).send({message : "success"})
    // console.log(req.params.id)
})


router.get('/' , async (req , res) => {
    const users = await Auth.find().select("-password")
    // findOne main who data ata hai jo search  karenge
    res.status(200).send({users : users})
})

router.post("/" , async (req , res) => {
    try {
        // validation throught joi
        await userShema.validateAsync(req.body)
        // convert to password in to hash form
        const password = await bcrypt.hash(req.body.password , 10)
        
        const user = new Auth({...req.body , password})
        const newUser = await user.save()
        // create token to verify api keys
        const token = jwt.sign({_id : newUser._id}, "SMIT")
        
        return res.status(200).send({ststus :  200 , message : "success" , user : newUser ,  token})
    } catch (err ) {
        return res.status(400).send({status : 400 , message : err.message})
    }
   
})
router.post("/login" , async (req , res) => {
    try {
        const {email , password} = req.body
        // to find user email / password in database (mongo db)
        const user = await Auth.findOne({email: email}).then(res => res.toObject())
        if(!user){
            return res.status(401).send({status : 401 , message : "user not found"})
        }
        // To compare password to verify for login
        const compare = await bcrypt.compare(password, user.password)
         if(!compare){
            return res.status(403).send({status : 403 , message : "incorrect password"})
        }
        delete user.password;
        // create token to verify api keys
        const token = jwt.sign({_id : user._id}, "SMIT")
        return res.status(200).send({ststus :  200 , user , token , message : "success" })
    } catch (err ) {
        return res.status(400).send({status : 400 , message : err.message})
    }
   
})

export default router