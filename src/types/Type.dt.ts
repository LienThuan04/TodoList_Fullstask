interface Itasks {
    _id: string;
    title: string;
    status: 'pending' | 'active' | 'in-progress' | 'completed';
    description?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt?: string;
}

export type { Itasks };