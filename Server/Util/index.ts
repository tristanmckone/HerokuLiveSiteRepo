import express, { Request, Response, NextFunction } from 'express';

//enable jwt 
import jwt from 'jsonwebtoken';
import * as DBconfig from '../config/db'

// convenience function to return the DisplayName of the user
export function UserDisplayName(req: Request): string
{
    if(req.user)
    {
        let user = req.user as UserDocument;
        return user.DisplayName.toString();
    }
    return '';
}

// custom authentication guard middleware
export function AuthGuard(req: Request, res: Response, next: NextFunction): void
{
    if(!req.isAuthenticated())
    {
        return res.redirect('/login');
    }
    next();
}

export function GenerateToken(user: UserDocument): string
{
    const payload =
    {
        id: user._id,
        DisplayName: user.EmailAddress,
        username: user.username
    }
    const jwtOptions =
    {
        expiresIn: 604800 // time in ms 1 week
    }

    return jwt.sign(payload, DBconfig.SessionSecret, jwtOptions);
}