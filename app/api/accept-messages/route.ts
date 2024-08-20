import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from 'next-auth';

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    // get user from the session
    const user: User = session?.user;

    if (!session || !session.user) {
        return Response.json({ success: false, msg: 'Not Authenticated' }, { status: 401 });
    }

    const userId = user._id;

    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessages: acceptMessages }, { new: true });

        if (!updatedUser) {
            return Response.json({ success: false, msg: 'Failed to update user status to accept messages' }, { status: 401 });
        }

        return Response.json({ success: true, msg: 'Message acceptance status updated successfully', updatedUser }, { status: 200 });
    } catch (error) {
        console.log('Failed to update user status to accept messages');
        return Response.json({ success: false, msg: 'Failed to update user status to accept messages' }, { status: 500 });
    }

}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    // get user from the session
    const user: User = session?.user;
    
    if (!session || !session.user) {
        return Response.json(
            { success: false, msg: 'Not Authenticated' },
            { status: 401 }
        );
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);

        if (!foundUser) {
            return Response.json({ success: false, msg: 'User not found' }, { status: 404 });
        }

        return Response.json(
            {
                success: true,
                msg: 'Message acceptance status found',
                isAcceptingMessages: foundUser.isAcceptingMessages
            },
            { status: 200 }
        );
    } catch (error) {
        console.log('Error in getting message acceptance status');
        return Response.json({ success: false, msg: 'Error in getting message acceptance status' }, { status: 500 });
    }
}