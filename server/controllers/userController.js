import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Register User:/api/user/register


export const register = async(req,res)=>{
    try{
        const{name,email, password}=req.body;
        if(!name||!email||!password){
            return res.json({
                success:false,message:'Missing Deatails'
            })
        }
        const existingUser= await User.findOne({email})

            if(existingUser)
                return res.json({success:false,message:'User already exists'})

            const hashedPassword = await bcrypt.hash(password,10)

            const user= await User.create({name, email,password:hashedPassword})

            const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

            res.cookie('token',token,{
                httpOnly:true,
                secure:  true,
            sameSite: "none",

                maxAge:7*24*60*100
            })

            return res.json({
                success:true,
                message:'User created',
                user:{email:email,name:user.name}

            })


    }catch(e){
         console.log(e.message)
        res.json({
           
            success:false,
            message:e.message
        })

    }
}

//login User:/api/user/login



export const login = async (req, res) => {
  try {
    

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing Details',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      
      secure:  true,
      sameSite:"none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      user: user.email,
      name: user.name,
      message:"Logged in successfully"
    });

  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// check Auth: /api/v1/user/is-auth

export const isAuth=async(req,res)=>{
  try{
    const {userId} =req.body;
    const user=await User.findById(userId).select("-password")
    return res.json({success:true,user})
  }catch(e){
    console.error(e.message,e);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
}

// Logout User: /api/user/logout

export const logout = async(req,res)=>{
  try{
    res.clearCookie('token',{
      httpOnly:true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',

    })
    return res.json(
      {
        success:true,
        message:"logged out"
      }
    )
  }catch(e){
    console.error(e.message);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
}
