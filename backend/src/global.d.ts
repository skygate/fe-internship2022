export {};
declare global {
    namespace Express {
        export interface User {
            userID: {
                _id: string;
                username: string;
                email: string;
            };
        }
    }
}
