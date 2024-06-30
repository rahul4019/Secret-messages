import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from 'next-auth';
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    // get user from the session
    const user: User = session?.user;

    if (!session || !session.user) {
        return Response.json({ success: false, msg: 'Not Authenticated' }, { status: 401 });
    }

    // updating user._id type from string 
    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]);

        if (!user || user.length === 0) {
            return Response.json({ success: false, msg: 'User not found' }, { status: 401 });
        }

        return Response.json({ success: true, messages: user[0].messages }, { status: 200 });
    } catch (error) {
        console.log('Error in getting user messages');
        return Response.json({ success: false, msg: 'Error in getting user messages' }, { status: 500 });
    }

}