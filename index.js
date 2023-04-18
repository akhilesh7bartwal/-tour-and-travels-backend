const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);

app.use(express.json());

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
}));
mongoose.connect(process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    
      }
    ).then(()=>{
        console.log("database connected.");
    });

app.get('/test',(req,res) =>{
    res.json('lessgo');
}
);

app.post('/register',async (req,res) =>{
    const {name,email,password} = req.body;
    try{
        const UserData = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        })
        console.log(UserData);
        res.json(UserData);
        UserData.save();
    }
    catch(e){
        res.status(422).json(e);
    }

})

app.post('/login', async(req,res)=>{
    const {email, password} = req.body;
    const userData = await User.findOne({email});
    try{
        if(userData){
            const comparePass = bcrypt.compareSync(password, userData.password);
            //console.log(comparePass);
            if(comparePass){
                res.json('password matched.');
            }
            else{
                res.status(422).json('password not matched.');
            }
        }
        else{
            res.status(400).json('not found');
        }
    }
    catch(error){
        res.status(422).json(error);
    }

});

app.listen(4000);