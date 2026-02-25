import { account, ID } from "./appwrite";

export class AuthService {
    async createAccount({ email, password, name }) {
        try {
            const userAccount = await account.create(
                ID.unique(),
                email,
                password,
                name
            );

            if (userAccount) {
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            console.log("AppWrite service :: createAccount :: error", error);
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            console.log("AuthService :: login :: attempt for:", email);
            const session = await account.createEmailPasswordSession(email, password);
            console.log("AuthService :: login :: success");
            return session;
        } catch (error) {
            console.error("AppWrite service :: login :: error", {
                code: error.code,
                message: error.message,
                type: error.type
            });
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await account.get();
        } catch (error) {
            console.log("AppWrite service :: getCurrentUser :: error", error);
        }
        return null;
    }

    async logout() {
        try {
            await account.deleteSessions();
        } catch (error) {
            console.log("AppWrite service :: logout :: error", error);
        }
    }
}

const authService = new AuthService();
export default authService;
