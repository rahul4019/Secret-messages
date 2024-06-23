import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { verifySchema } from "@/schemas/verifySchema";

const verificationCodeSchema = z.object({
    code: verifySchema
});

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);

        // Validate with zod
        const result = verificationCodeSchema.safeParse(code);

        if (!result.success) {
            const codeErrors = result.error.format().code?._errors || [];
            return Response.json({ success: false, msg: codeErrors?.length > 0 ? codeErrors.join(',') : 'Invalid verification code' }, { status: 400 });
        }

        const user = await UserModel.findOne({ username: decodedUsername });

        if (!user) {
            return Response.json(
                { success: false, msg: 'User not found' },
                { status: 404 }
            );
        }

        const isCodeValid = user.verificationCode === code;
        const isCodeNotExpired = new Date(user.verificationCodeExpiry) > new Date();

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();

            return Response.json(
                { success: true, msg: 'Account verified Successfully' },
                { status: 200 }
            );
        } else if (!isCodeNotExpired) {
            return Response.json(
                { success: false, msg: 'Verification code has expired, Please signup again to get a new code' },
                { status: 400 }
            );
        } else {
            return Response.json(
                { success: false, msg: 'Incorrect verification code' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error verifying user: ', error);
        return Response.json(
            { success: false, msg: 'Error verifying user' },
            { status: 500 }
        );
    }
}