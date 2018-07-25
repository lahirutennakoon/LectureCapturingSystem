// var mongoose = require('mongoose');
// const Schema = mongoose.Schema;
//
// const backupUserSchema = new Schema({
//     username: {
//         type: String,
//         index: { unique: true },
//         required: true
//     },
//     password:{
//         type: String,
//         required: true
//     },
//     created: {
//         type: Date,
//         required: true,
//         default: new Date()
//     },
//     usertype: {
//         type: String,
//         required: true
//     },
//     images: [{
//         type: String
//     }]
// });
//
// // passwordSchema.methods.comparePassword = function comparePassword(password, callback) {
// //     bcrypt.compare(password, this.password, callback);
// // };
// //
// // // On save, hash the password
// // passwordSchema.pre('save', function saveHook(next) {
// //     var user = this;
// //
// //     if(!user.isModified('password')){
// //         return next();
// //     }
// //
// //     return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
// //         if(err){ return next(err); }
// //
// //         return bcrypt.hash(user.password, salt, function(hashError, hash){
// //             if(hashError){
// //                 return next(hashError);
// //             }
// //             user.password = hash;
// //             return next();
// //         });
// //     });
// // });
//
//
// module.exports = mongoose.model('backupUsers', backupUserSchema);