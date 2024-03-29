
const Users = require("@models/users")
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const rn = require('random-number');
var mongoose = require('mongoose');


const findById1 = async (id) => {
  const users = await Users.aggregate([
    {
      "$match": {
        _id: mongoose.Types.ObjectId(id),
      }
    },
    {
      $lookup: {
        from: "images",
        localField: "_id",
        foreignField: "userID",
        as: "images"
      }
    },
    {
      $project: {
        _id: 1,
        username: 1,
        firstName: 1,
        lastName: 1,
        gender: 1,
        dayofbirth: 1,
        fullname: 1,
        location: 1,
        phone: 1,
        email: 1,
        role: 1,

        images: {
          _id: 1,
          name: 1,
          imageUrl: 1,
          desc: 1,
        }
      }
    }
  ])

  if (!users?.length)
    return null

  return users[0]
}


const findById = async (id) => {
  try {
    const user = await Users.findById(id);
    return user;
  } catch (err) {
    throw "User is not found"
  }
}

const findAll = async (pageNum = 0)  => {
  const limit = 5;
  try {
    const result = await Users.find().skip(pageNum * limit ).limit(limit);

    return result;
  } catch (err) {
    throw "Can't collect data"
  }

}

const resetPass = async (id, password, repeat_password) => {
  try {
    var salt = bcrypt.genSaltSync(10);
    var hashedPass = bcrypt.hashSync(password, salt);
    const user = await Users.findById(id);
    if (password != repeat_password) {
        throw "The password is not equal repeat_password !!!"
      }
        const updatePass = await Users.updateOne({"_id": id}, {"password": hashedPass});
        if (updatePass) {
            return {success: true};
        } else {
            return {success: false, error: "Failed to change password"};
        }
    } catch (err) {
        return {success: false, error: err};
    }
}


const updatePass = async (id, newPassword, oldPassword) => {

  try {
    var salt = bcrypt.genSaltSync(10);
    var hashedPass = bcrypt.hashSync(newPassword, salt);
   const user = await Users.findById(id);
    if (!user.matchesPassword(oldPassword)) {
      throw "The user's information is incorrect~"
    }
        const updatePass = await Users.updateOne({"_id": id}, {"password": hashedPass});
        if (updatePass) {
            return {success: true, data: updatePass};
        } else {
            return {success: false, error: "Failed to change password"};
        }
    } catch (err) {
        return {success: false, error: err};
    }
}

const update = async (id,username,firstName,lastName,gender,email,dayofbirth,location,phone) => {
  try {
    const user = await Users.findById(id);
    //update data
    user.username = "test";
    user.firstName = firstName;
    user.lastName = lastName;
    user.gender = gender;
    user.email = email;
    user.dayofbirth = dayofbirth;
    user.location = location;
    user.fullname = firstName +" "+lastName
    user.phone = phone;
    // user.imageUrl = imageUrl;

    await user.save();

    user.username = username;
    user.firstName = firstName;
    user.lastName = lastName;
    user.gender = gender;
    user.email = email;
    user.dayofbirth = dayofbirth;
    user.location = location;
    user.phone = phone;
    // user.imageUrl = imageUrl;

    await user.save();

    return{ success: true, data: user };
  } catch (err) {
    return {success: false,error: err}
  }
}

const forgetpassword = async (name) => {
 try {
   const forget = await Users.find({ "email": name });
   const id = forget[0]._id;

   if (forget != "") {

          // code random here
          var options = {
            min: 1000,
            max: 10000, integer: true
          }
           console.log(rn(options));
           const number = rn(options)
           const textsend = "You code: " + number;

             let mailTransporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "verifypass7@gmail.com",
                pass: "Vichea11"
              }
            })

            let details = {
              from: "verifypass7@gmail.com",
              to: name,
              subject: "Get Code",
              text:textsend,
            }
            mailTransporter.sendMail(details, (err) => {
              if (err) {
                console.log("it has an error ",err)
              } else {
                console.log("email has sent!")
              }
            })
            return {success: true, id:id , code: number};
        } else {
            return {success: false, error: "Your email does not exist"};
        }
    } catch (err) {
        return {success: false, error: err};
    }
}

const remove = async (id) => {
 try {
        const retDelete = await Users.deleteOne({"_id": id});
        if (retDelete) {
            return {success: true, data: retDelete};
        } else {
            return {success: false, error: "User's id does not exist"};
        }
    } catch (err) {
        return {success: false, error: err};
    }
}



const finduserImg = async () => {
  return await Users.aggregate([
    {
      $lookup: {
        from: "images",
        localField: "_id",
        foreignField: "userID",
        as: "images"
      }
    },
    {
      $project: {
        _id: 1,
        username: 1,
        firstName: 1,
        lastName: 1,
        gender: 1,
        dayofbirth: 1,
        fullname: 1,
        location: 1,
        phone: 1,
        email: 1,
        role: 1,

        images: {
          UserID: 1,
          name: 1,
          imageUrl: 1,
          desc: 1,
        }
      }
    }
  ])
}

module.exports = {
  findById,
  findById1,
  updatePass,
  update,
  remove,
  findAll,
  forgetpassword,
  resetPass,
  finduserImg
}
