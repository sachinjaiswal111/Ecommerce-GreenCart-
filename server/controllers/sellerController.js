

import jwt from 'jsonwebtoken'

// seller : /api/seller/login

export const sellerLogin = async (req, res) => {
    try{
const { email, password } = req.body;

    if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL)
 {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie('sellerToken',token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return res.json({ success: true, message: "Logged In" })


    } else {
        return res.json({
            success: false,
            message: "Invalid deatails"
        })
    }
    }catch(e){
        console.log(e);
        res.json({success:false,message:error.message})

    }
}

// sellerisauth Auth: /api/v1/user/is-auth

export const sellerIsAuth=async(req,res)=>{
  try{
    return res.json({success:true})
  }catch(e){
    console.error(e.message);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
}



export const sellerLogout = async(req,res)=>{
  try{
    res.clearCookie('sellerToken',{
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
    console.error(e);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
}
