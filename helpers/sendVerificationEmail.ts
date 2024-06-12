import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(email: string, username: string, verificationCode: string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Secret Message | Verification Code',
            react: VerificationEmail({ username, otp: verificationCode })
        });
        return { success: true, msg: 'Verification email sent successfully' };
    } catch (emailError) {
        console.log('Error sending verification email', emailError);
        return { success: false, msg: 'Failed to send verification email' };
    }
}

