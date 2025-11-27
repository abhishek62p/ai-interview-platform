import {prisma} from "@/prisma/prisma"
import bcrypt from "bcrypt";


export const getUserByEmail = async (email: string) => {
    try {
        return await prisma.user.findUnique({
            where: {
                email: email,
            }
        });
    } catch (err) {
        console.error("Error in getUserByEmail:", err);
        throw err; // Re-throw the error instead of silently returning null
    }
}

export const CreateNewUser = async (userData: any) => {
    const {email, password, fullname, role} = userData;
    try {
        await prisma.user.create({
            data: {
                email: email,
                password: await hashPassword(password),
                name: fullname,
                role: role || "CANDIDATE",
            }
        })
    } catch (err) {
        // Propagate known Prisma errors (e.g., P2002 unique constraint)
        throw err;
    }
}

export const hashPassword = async (password: string) => {
    const saltRound = 10;
    return await bcrypt.hash(password, saltRound);
}

export const compareHash = async (hash: string, password: string) => {
    return await bcrypt.compare(password, hash);
}
