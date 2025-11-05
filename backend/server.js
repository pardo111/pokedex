import express from 'express';
import cors from 'cors';
import pokeRoutes from './src/routes/poke.route.js';

const app = express();
const PORT = 3000;

const API_BASE = 'https://pokeapi.co/api/v2/';

app.use(cors());
app.disable("x-powered-by");

app.use((req, res, next) => {
  res.removeHeader("Content-Security-Policy");
  next();
});


app.use(express.json());

app.use('/api', pokeRoutes);    
 
app.listen(PORT, ()=>{
    console.log(`si me levante a chambear, digo...\n\n\nServer is running on port ${PORT}`);
});   

