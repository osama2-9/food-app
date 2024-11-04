import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../Model/User";
import { generateToken } from "../utils/generateToken";
import { sendVC } from "../emails/SendVerificationCode";
import generateVerificationCode from "../utils/generateVerificationCode";

export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const { firstname, lastname, email, password, phone } = req.body;

    if (!firstname || !lastname || !email || !password || !phone) {
      return res.status(400).json({
        error: "Please fill all form fields.",
      });
    }

    const findSameEmailOrPhone = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (findSameEmailOrPhone) {
      return res.status(400).json({
        error: "Email or phone already used.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      email,
      phone,
      password: hashPassword,
    });

    const createdUser = await newUser.save();

    if (createdUser) {
      generateToken(createdUser._id.toString(), res);

      return res.status(201).json({
        message: "Account created successfully.",
        userData: {
          firstname,
          lastname,
          email,
          phone,
          uid: createdUser._id,
          isAdmin: createdUser.isAdmin,
          isVerified: createdUser.isVerified
        }
      });
    }

    return res.status(500).json({ error: "Failed to create account." });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const checkAuth = async (req: Request, res: Response): Promise<any> => {
  try {
    const cookie = await req.cookies.auth
    if (!cookie) {
      return res.status(401).json({
        error: "Unauthorized"
      })
    } else {
      return res.status(200).json({
        success: true
      })
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error"
    })

  }
}



export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Please fill all form fields.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    generateToken(user._id.toString(), res);

    return res.status(200).json({
      uid: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified

    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      error: "Internal server error.",
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    res.cookie("auth", null, {
      maxAge: 1,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { uid, firstname, lastname, email, phone } = req.body;
    if (!uid) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    const user = await User.findById(uid);
    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    user.firstname = firstname || user.firstname;
    user.lastname = lastname || user.lastname;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    const update = await user.save();
    if (!update) {
      return res.status(400).json({
        error: "error occured while updating",
      });
    }
    return res.status(200).json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};


export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.body
    if (!userId) {
      return res.status(400).json({
        error: "User not found"
      })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(400).json({
        error: "User not found"
      })
    }
    const deleteAttemp = await user.deleteOne()
    if (deleteAttemp) {
      return res.status(200).json({
        message: "User deleted successfully"
      })

    } else {
      return res.status(400).json({
        error: "Error while try delete user"
      })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error"
    })


  }
}

export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await User.find();


    const usersData = users.map((user) => ({
      uid: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin


    }));


    return res.status(200).json(usersData);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};




export const sendVerificationCode = async (req: Request, res: Response): Promise<any> => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ error: "No user found" });
    }

    const user = await User.findById(uid);
    if (!user) {
      return res.status(400).json({ error: "No user found" });
    }




    const code = generateVerificationCode();
    const token = generateToken(uid, res);
    user.verificationCode = code
    user.verificationCodeToken = token
    user.verificationCodeTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000)
    const verificationCodeURL = `http://localhost:3000/email-verifiy/${token}`;

    await user.save();

    await sendVC(user.email, code, verificationCodeURL);

    return res.status(200).json({ message: "Verification code sent successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const verifyEmail = async (req: Request, res: Response): Promise<any> => {
  try {
    const { token, verificationCode } = req.body;

    if (!token || !verificationCode) {
      return res.status(400).json({
        error: "Missing required parameters"
      });
    }

    const user = await User.findOne({ verificationCodeToken: token });
    if (!user) {
      return res.status(400).json({
        error: "No user found"
      });
    }


    const now = new Date(Date.now());
    if (now > user.verificationCodeTokenExpiresAt) {
      return res.status(401).json({
        error: "Token has expired"
      });
    }

    if (user.verificationCode === verificationCode) {
      user.isVerified = true;
      user.verificationCodeToken = undefined;
      user.verificationCode = undefined;
      user.verificationCodeTokenExpiresAt = undefined;

      await user.save();

      return res.status(200).json({
        message: "Account verified successfully"
      });
    } else {
      return res.status(400).json({
        error: "Invalid verification code"
      });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error"
    });
  }
};






