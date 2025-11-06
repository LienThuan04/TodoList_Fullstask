type User = {
    id: string;
    email: string;
    username: string;
    avatar: string | null;
}
export type { User };

declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }

}