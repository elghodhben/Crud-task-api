const mongoose =  require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/taskmanagerdb')
.then( () => {
    console.log("DB connected Sucessfully !")
})

.catch( (error) => { console.log(error) } );

module.exports = mongoose;