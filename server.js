const PORT = 8000

const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()


app.use(express.json())
app.use(cors())


app.post('/completions',async(req,res)=>{
    let options ={
        method:"POST",
        headers:{
            'Authorization':`Bearer ${process.env.API_KEY}`,
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            model:"gpt-3.5-turbo",
            messages: [{"role": "user", "content":req.body.message}],
            max_tokens:100
        })

    }

    try {
       const response = await fetch('https://api.openai.com/v1/chat/completions',options)
       const data = await response.json()
       res.status(200).send(data)
    } catch (error) {
        console.log("error-=",error)
    }
})


app.listen(PORT,()=>{
    console.log("Server is running on port "  + PORT)
})

