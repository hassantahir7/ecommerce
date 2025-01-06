import { BadRequestException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';



export async function hashPassword(userPassword: string) {
    const saltOrRounds = parseInt(process.env.Salt_Or_Rounds)
    const hashedPassword = await bcrypt.hash(userPassword, saltOrRounds);
    return hashedPassword
}

export async function comparePassword(userPassword: string, storedPassword: string) {
    const verifyPassword = await bcrypt.compare(userPassword, storedPassword);
    if (!verifyPassword) {
        throw new BadRequestException('Invalid Credentials')
    }
    return verifyPassword
}



export function isEmailOrPhoneNumber(username: string): 'email' | 'phone' | 'neither' {
    const emailRegex = /^[a-zA-Z_][a-zA-Z0-9_.]*@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    const phoneRegex = /^\+?\d{10,15}$/;

    if (emailRegex.test(username)) {
        return 'email';
    } else if (phoneRegex.test(username)) {
        return 'phone';
    } else {
        throw new BadRequestException('Invalid Username')
    }
}


// export async function generateAndStoreOTP(username: string,type:string, prisma: PrismaService)//: Promise<number> 
// {
//     // Generate a random 4-digit number
//     const randomNumber = Math.floor(1000 + Math.random() * 9000);
//     console.log(randomNumber);


//     try {
//         // Store the generated number in the database
//         // const updatedRecord = await prisma.yourModelName.update({
//         //     where: { yourIdentifierField: targetNumber }, // Specify the target record using its identifier
//         //     data: { randomNumber }, // Update the record with the generated number
//         // });
//         const usernameType = isEmailOrPhoneNumber(username)
//         const generatedCode = await this.prisma.verify_user.create({
//             where:{
//                 username:username,
//                 otp:randomNumber,
//                 usernameType:usernameType,
//                 type:type

//             }
//         })
//         // Return the generated number
//         return generatedCode;
//     } catch (error) {
//         // Handle errors
//         throw new Error(`Failed to generate and store random number: ${error.message}`);
//     }
// }
export function generateRandom4DigitNumber() {
    const random4DigitNumber = Math.floor(Math.random() * 10000);
    const formattedNumber = String(random4DigitNumber).padStart(4, '0');
    return formattedNumber;
}

export function generateRandomPassword(): string {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const specialChars = '@$!%*?&';
    const digits = '0123456789';

    const minLength = 8;
    let password = '';

    // This is the requiremnet for login so follow the constraints when generating random passsword
    // Password should have atleast 1-UpperCase Letter, 1-LowerCase Letter, 1-Special Character, 1-Digit and should have more than 8 Characters
    password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];// Include at least one uppercase letter
    password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];// Include at least one lowercae letter
    password += specialChars[Math.floor(Math.random() * specialChars.length)]; // Include at least one special character
    password += digits[Math.floor(Math.random() * digits.length)];// Include at least one digit

    const remainingLength = minLength - password.length;
    const allChars = uppercaseChars + lowercaseChars + specialChars + digits;
    for (let i = 0; i < remainingLength; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    password = password.split('').sort(() => Math.random() - 0.5).join(''); // Shuffle password for randomness

    return password;
}