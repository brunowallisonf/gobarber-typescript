import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../models/User';

interface Request {
    email: string;
    password: string;
}

export default class AuthenticateUserService {
    public async execute({
        email,
        password,
    }: Request): Promise<{ user: User; token?: string }> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new Error('incorrect email/password combination');
        }
        const passwordMatched = await compare(password, user.password);
        if (!passwordMatched) {
            throw new Error('incorrect email/password combination');
        }

        const token = sign({}, '5d80f0ffab4d5b98c46b85b93ce931ec', {
            subject: user.id,
            expiresIn: '1d',
        });
        return {
            user,
            token,
        };
    }
}
