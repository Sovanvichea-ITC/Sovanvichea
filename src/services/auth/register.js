const Users = require("@models/users");

const register = async(params) => {
    try {
        const { email, username, firstName, lastName, password, role,gender,dayofbirth,location ,phone,ImageUrl} = params;

        // check if email existed
        const existed = await Users.findOne({ email });
        if (existed) {
             return {
                success: false,
                error: "User is already existed~"
            }
        }
        const vendor = false;
        // create a new user
        const newUser = {
            email,
            username,
            firstName,
            lastName,
            gender,
            dayofbirth,
            password,
            role,
          vendor,
          phone: "none",
          location: "none",
          ImageUrl:"none",
          fullname:firstName +" "+lastName
        }

        const createdUser = await Users.create(newUser);
        return {
            success: true,
            data: createdUser
        }
    } catch (err) {
        console.log(err);
        return {
            success: false,
            error: err || 'error'
        }
    }
}

module.exports = {
    register
}
