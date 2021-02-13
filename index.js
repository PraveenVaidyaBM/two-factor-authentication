const express = require('express')
const speakeasy = require('speakeasy')
const uuid = require('uuid')
const {JsonDB} = require('node-json-db')
const {Config} = require('node-json-db/dist/lib/JsonDBConfig')

const app = express()

app.use(express.json())

const db = new JsonDB(new Config('myDatabase', true, false,'/'))

app.get('/api', (req, res) => res.json('Welcome to 2 factor authentication example'))

//register
app.get('/api/register', (req, res) => {
    const id = uuid.v4();

    try {
        const path = `user/${id}`
        const secret = speakeasy.generateSecret();
        db.push(path,{id, secret})
        res.json({id,secretkey:secret.base32})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'error in generating the secret key'})
    }
})

//verify
app.get('/api/verify', (req, res) => {
    const {token, userId} = req.body

    try {
        const path =`/user/${userId}`
        const user = db.getData(path)
        
        const {base32:secret} = user.temp_secret

        var verified = speakeasy.totp.verify({secret,
            encoding:'base32',
            token
        })

        if(verified){
            db.push(path,{id:userId,secret:user.temp_secret})
            res.json({verified:true})
        }else{
            res.json({verified:false})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({message:'veriicaation failed'})
    }
})


//validate
app.get('/api/validate', (req, res) => {
    const {token, userId} = req.body

    try {
        const path =`/user/${userId}`
        const user = db.getData(path)
        
        const {base32:secret} = user.secret

        var tokenValidate = speakeasy.totp.verify({secret,
            encoding:'base32',
            token,window:1
        })

        if(tokenValidate){
            db.push(path,{id:userId,secret:user.secret})
            res.json({validated:true})
        }else{
            res.json({validated:false})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({message:'validation failed'})
    }
})


const PORT = process.env.PORT || 5000


const express = require('express')
const speakeasy = require('speakeasy')
const uuid = require('uuid')
const {JsonDB} = require('node-json-db')
const {Config} = require('node-json-db/dist/lib/JsonDBConfig')

const app = express()

app.use(express.json())

const db = new JsonDB(new Config('myDatabase', true, false,'/'))

app.get('/api', (req, res) => res.json('Welcome to 2 factor authentication example'))

//register
app.get('/api/register', (req, res) => {
    const id = uuid.v4();

    try {
        const path = `user/${id}`
        const secret = speakeasy.generateSecret();
        db.push(path,{id, secret})
        res.json({id,secretkey:secret.base32})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:'error in generating the secret key'})
    }
})

//verify
app.get('/api/verify', (req, res) => {
    const {token, userId} = req.body

    try {
        const path =`/user/${userId}`
        const user = db.getData(path)
        
        const {base32:secret} = user.temp_secret

        var verified = speakeasy.totp.verify({secret,
            encoding:'base32',
            token
        })

        if(verified){
            db.push(path,{id:userId,secret:user.temp_secret})
            res.json({verified:true})
        }else{
            res.json({verified:false})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({message:'veriicaation failed'})
    }
})


//validate
app.get('/api/validate', (req, res) => {
    const {token, userId} = req.body

    try {
        const path =`/user/${userId}`
        const user = db.getData(path)
        
        const {base32:secret} = user.secret

        var tokenValidate = speakeasy.totp.verify({secret,
            encoding:'base32',
            token,window:1
        })

        if(tokenValidate){
            db.push(path,{id:userId,secret:user.secret})
            res.json({validated:true})
        }else{
            res.json({validated:false})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({message:'validation failed'})
    }
})


const PORT = process.env.PORT || 5000


app.listen(PORT, ()=> console.log(`app listening on port ${PORT}`))