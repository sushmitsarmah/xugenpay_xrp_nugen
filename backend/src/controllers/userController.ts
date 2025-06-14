import { Request, Response } from 'express';
import {
    upsertUser,
    getUserByUsername,
    getUsers,
    searchUsersByUsername,
    getUserByWallet
} from '../services/userService';

export const createOrUpdateUserHandler = async (req: Request, res: Response) => {
    try {
        const userData = req.body;
        const result = await upsertUser(userData);
        res.status(200).json(result);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getUserByUsernameHandler = async (req: Request, res: Response) => {
    try {
        const { username } = req.params;
        const user = await getUserByUsername(username);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getUserByAddressHandler = async (req: Request, res: Response) => {
    try {
        const { address } = req.params;
        const user = await getUserByWallet(address);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const searchByUsername = async (req: Request, res: Response) => {
    try {
        const search = req.query.search as string || '';
        const users = await searchUsersByUsername(search);
        res.status(200).json(users);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};