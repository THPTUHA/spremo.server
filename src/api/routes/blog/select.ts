import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { time, wrapAsync } from '../../../services/helper';
import { BlogModel } from '../../../models/blog/blog';
import { PUBLIC, SELECTED } from '../../../Constants';

export default (router: Router) => {
    router.post("/select",  
        multer({}).fields([]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {
                const {id} = req.body;
                const blog = await BlogModel.findByPk(id);
                if(!blog){
                    return res.status(200).send(new BaseError("Blog not found!", BaseError.Code.ERROR).release());
                }
                if(blog.status != PUBLIC){
                    return res.status(200).send(new BaseError("Blog is'nt public!", BaseError.Code.ERROR).release());
                }
                
                blog.selected = SELECTED;
                blog.selected_since = time();
                await blog.edit(["selected","selected_since"]);

                return res.status(200).send({
                    blog: blog.release(),
                    code: BaseError.Code.SUCCESS
                });
            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};