const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    descreption:{
        type:String,
        required: true,
        trim: true
    },
    completed:{
        type:Boolean,
        default: false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
        toJSON: {virtuals: true}
    }
},{
    timestamps:true
})

// taskSchema.pre('save', function (next) {
//     const task = this

//     if(task.isModified('descreption')){
//         task.completed = false
//     }
//     next()
// })
const Tasks = mongoose.model('Tasks', taskSchema )

module.exports = Tasks