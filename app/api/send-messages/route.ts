import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

import { Message } from "@/model/user";

export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();

    try {
        const user = await UserModel.findOne({ username });

        if (!user) {
            return Response.json({ success: false, msg: 'User not found' }, { status: 404 });
        }

        // if user accepting the message
        if (!user.isAcceptingMessages) {
            return Response.json({ success: false, msg: 'User is not accepting the messages' }, { status: 403 });
        }

        const newMessage = { content, createdAt: new Date() };
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({ success: true, msg: 'message sent successfully' }, { status: 200 });
    } catch (error) {
        console.log('Error in getting user messages', error);
        return Response.json({ success: false, msg: 'Internal server error' }, { status: 500 });
    }
}
