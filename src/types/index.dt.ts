type User = {
    id: string;
    email: string;
    username: string;
}
export type { User };

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }

}