import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number; // value could be or could be not
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log('Already connected to the DB');
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '');

        // extracting readystate which is a number
        connection.isConnected = db.connections[0].readyState;

        console.log('DB Connected Successfully');
    } catch (error) {
        console.log('Database connection failed', error);
        process.exit(1);
    }
}

export default dbConnect;