import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { wrapAsync } from '../../../services/helper';
import { UserModel } from '../../../models/user/user';
import { BlogModel } from '../../../models/blog/blog';

export default (router: Router) => {
    router.post("/draw.get",  
        wrapAsync(async(req, res)=>{
            const {id, is_me} = req.body;
            try {
                // if(is_me){
                //     const user =
                // }
                const draw = await BlogModel.findByPk(id);

                if(!draw){
                    return res.status(200).send(new BaseError("Draw is not exist!", BaseError.Code.ERROR).release());
                }

                return res.status(200).send({
                    draw: draw.release(),
                    code: BaseError.Code.SUCCESS
                });

            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};