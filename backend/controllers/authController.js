const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("cloudinary");
const crypto = require("crypto");

exports.registerUser = async (req, res, next) => {
    console.log(req.body);
    const result = await cloudinary.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: "scale"
    }, (err, res) => {
        console.log(err, res);
    });
    console.log(result)
    const { name,
        email,
        password,
        role

    } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        role,
        avatar: {
            public_id: result.public_id,
            url: result.secure_url
        }
    })

    sendToken(user, 200, res)
};

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user

    if (!email || !password) {
        return next(new ErrorHandler("Please enter email & password", 400));
    }

    // Finding user in database

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    // Checks if password is correct or not

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401));
    }
    sendToken(user, 200, res);
};

exports.logout = async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),

        httpOnly: true,
    });

    res.status(200).json({
        success: true,

        message: "Logged out",
    });
};

exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found with this email", 404));
    }

    // Get reset token

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset password url

    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `<p>Your password reset token is as follow:\n\n<a href="${resetUrl}">Reset Password</a>\n\nIf you have not requested this email, then ignore it.</p>`;

    const html = `<p>Your password reset token is as follow:\n\n<a href="${resetUrl}">Reset Password</a>\n\nIf you have not requested this email, then ignore it.</p>`;

    try {
        await sendEmail({
            email: user.email,

            subject: "Taro E-Assist Password Recovery",

            message,

            html,
        });

        res.status(200).json({
            success: true,

            message: `Email sent to: ${user.email}`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;

        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
};

exports.resetPassword = async (req, res, next) => {
    // Hash URL token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,

        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHandler(
                "Password reset token is invalid or has been expired",
                400
            )
        );
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    // Setup new password

    user.password = req.body.password;

    user.resetPasswordToken = undefined;

    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
};

exports.getUserProfile = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    sendToken(user, 200, res);
};

exports.updatePassword = async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched) {
        return next(new ErrorHandler("Old password is incorrect"));
    }
    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);
};

exports.allUsers = async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
};

exports.updateUser = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        // useFindAndModify: false
    });

    res.status(200).json({
        success: true,
    });
};

exports.updateProfile = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };
    // Update avatar

    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);
        const image_id = user.avatar.public_id;
        const res = await cloudinary.uploader.destroy(image_id);
        const result = await cloudinary.v2.uploader.upload(
            req.body.avatar,
            {
                folder: "avatars",
                width: 150,
                crop: "scale",
            },
            (err, res) => {
                console.log(err, res);
            }
        );
        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url,
        };
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        // useFindAndModify: false
    });
    res.status(200).json({
        success: true,
    });
};

exports.getUserDetails = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(
            new ErrorHandler(`User does not found with id: ${req.params.id}`)
        );
    }

    res.status(200).json({
        success: true,

        user,
    });
};

exports.updateUser = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,

        email: req.body.email,

        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,

        runValidators: true,

        // useFindAndModify: false
    });

    res.status(200).json({
        success: true,
    });
};

exports.deleteUser = async (req, res, next) => {
    let user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
    }

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    user = await User.findByIdAndRemove(req.params.id)

    res.status(200).json({
        success: true,
        user,
    });
};

exports.googlelogin = async (req, res, next) => {
    console.log(req.body.response);
    const userfind = await User.findOne({ googleId: req.body.response.id })
    if (!userfind) {
        let createuser = await User.create({
            name: req.body.response.name,
            email: req.body.response.email,
            password: 'password',
            avatar: {
                public_id: 'avatars/avatar-default',
                url: req.body.response.picture,
            },
            googleId: req.body.response.id
        });
        var user = await User.findOne({ googleId: createuser.googleId })
        sendToken(user, 200, res);
    }

    else {
        const user = await User.findOne({ googleId: req.body.response.id })
        sendToken(user, 200, res);
    }
};