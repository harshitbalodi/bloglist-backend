const app = require('./app');
const {info} = require('./utils/loggers');

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  info(`Server running on port ${PORT}`)
  
})

process.on('SIGINT',async ()=>{
  await mongoose.connection.close((err)=>{
    if(err){
        error("Error closing the mongoose connection:",err);
    }else{
        info('mongoose connection is closed');
    }
    
    process.exit(0);
  }); 
})

