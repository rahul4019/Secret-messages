import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/user";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        const existingUserVerifiedByUsername = await userModel.findOne({ username, isVerified: true });

        if (existingUserVerifiedByUsername) {
            return Response.json({ success: false, msg: 'Username is already taken' }, { status: 400 });
        }

        const existingUserByEmail = await userModel.findOne({ email });

        const verificationCode = Math.floor(100000 + Math.random() * 90000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    msg: 'User already exist with this email'
                }, {
                    status: 400
                });
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verificationCode = verificationCode;
                existingUserByEmail.verificationCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new userModel({
                username,
                email,
                password: hashedPassword,
                verificationCode,
                verificationCodeExpiry: expiryDate,
                isAcceptingMessages: true,
                isVerified: false,
                messages: []
            });

            await newUser.save();
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(email, username, verificationCode);

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                msg: emailResponse.messages
            }, {
                status: 500
            });
        }

        return Response.json({
            success: true,
            msg: 'User registered successfully. Please verify your email'
        }, {
            status: 201
        });

    } catch (error) {
        console.log('Error registering user: ', error);
        return Response.json({
            success: false,
            msg: "Error registering user"
        }, { status: 500 });
    }
}

