import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveyUsersRepository } from "../repositories/SurveysUsersRepository";


class AnswerClontroller{



    /**
     * 
        Route Params => parametros que compõe a rota / 
        routes.get("/answers/:value")

        Query Params => Busca, Paginacao, não obrigatorios
        ?

        chave=valor
     */


    async execute(request: Request, response: Response){
        const { value } = request.params;
        const { u } = request.query;

        const surveysUsersRepository = getCustomRepository(SurveyUsersRepository)

        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u)
        });

        if (!surveyUser){
            throw new AppError("Survey User does not exists!")
        }

        
        surveyUser.value = Number(value);

        await surveysUsersRepository.save(surveyUser)

        return response.json(surveyUser)
    }
}

export { AnswerClontroller }