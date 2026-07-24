import express from 'express';
const PORT = process.env.PORT;

const app = express();

app.get('/health', (req, res)=>{
    res.status(200).json({"status":"OK"});
})

app.listen(PORT, ()=>console.log(`Listening on PORT ${PORT}`));