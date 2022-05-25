export {};
declare global {
    namespace Express {
        export interface User {
            _id: string;
            username: string;
            email: string;
        }
    }
}
