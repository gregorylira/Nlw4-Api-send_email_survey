import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRespository';
import * as yup from 'yup'
import { AppError } from '../errors/AppError';

class UserController {
    async create(request: Request, response: Response){
        const { name, email } = request.body;

        const schema = yup.object().shape({
            name: yup.string().required("Nome é Obrigatorio"),
            email: yup.string().email().required("Email é invalido")
        })

        try {
            await schema.validate(request.body, { abortEarly: false });
        } catch (error) {
            throw new AppError(error)
        }
        
        const userRepository = getCustomRepository(UsersRepository);

        // SELECT * FROM USERS WHERE EMAIL = *EMAIL*
        const userAlreadyExists = await userRepository.findOne({
            email
        })

        if(userAlreadyExists){
            throw new AppError("User Already exists!")
        }

        const user = userRepository.create({
            name,email
        })

        await userRepository.save(user);

        return response.status(201).json(user);
    }
}

export { UserController };
