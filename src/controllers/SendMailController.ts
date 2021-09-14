import { Request, Response } from "express";
import { resolve } from 'path';
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { User } from "../models/User";
import { SurveyRepository } from "../repositories/SurveyRespository";
import { SurveyUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRespository";
import SendMailService from "../services/SendMailService";



class SendMailController{

    async execute(request: Request, response: Response){
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveyRepository = getCustomRepository(SurveyRepository);
        const surveysUsersRepository = getCustomRepository(SurveyUsersRepository);

        const user = await usersRepository.findOne({email})

        if(!user){
            throw new AppError("User does not exists!")
        }

        const survey = await surveyRepository.findOne({id: survey_id})

        if(!survey){
            throw new AppError("Survey does not exists!")
        }

        
        const npsPath = resolve(__dirname, "..", "views","emails", "npsMail.hbs")

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: {user_id: user.id, value : null},
            relations: ["user","survey"]
        })

        const variables = {
            name: user.name,
            titulo: survey.titulo,
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }

        if(surveyUserAlreadyExists){
            variables.id = surveyUserAlreadyExists.id;
            await SendMailService.execute(email,survey.titulo,variables,npsPath)
            return response.json(surveyUserAlreadyExists)
        }

        //salvar as informações na tabela surveyUsers
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        })
        await surveysUsersRepository.save(surveyUser)
        //Enviar e-mail para o usuario
        
        variables.id = surveyUser.id
        

        await SendMailService.execute(email, survey.titulo,variables,npsPath);

        return response.json(surveyUser);
    }
}


export {SendMailController}