import { Router } from 'express';
import BaseError from '../../../packages/base.error/BaseError';
import multer from 'multer';
import passport from "passport"
import { getExactDayNow, wrapAsync } from '../../../services/helper';
import { BlogModel } from '../../../models/blog/blog';
import { CommentModel } from '../../../models/comment/comment';
import { UserModel } from '../../../models/user/user';
import { time } from 'console';
import FirebaseFunctions from '../../../packages/firebase/functions';
import { RecordModel } from '../../../models/record/Record';
import { RECORD_TYPE, ROLES } from '../../../Constants';

export default (router: Router) => {
    router.post("/comment.add",  
        multer({}).fields([{ name: 'image' }, { name: 'audio' }]),
        passport.authenticate('jwt', { session: false }),
        wrapAsync(async(req, res)=>{
            try {
                const {blog_id, content} = req.body;
                if(!content){
                    return res.status(200).send(new BaseError("Content empty!", BaseError.Code.ERROR).release());
                }

                const blog = await BlogModel.findByPk(blog_id);
                if(!blog){
                    return res.status(200).send(new BaseError("Blog not found!", BaseError.Code.ERROR).release());
                }

                const user = req.user as UserModel;

                const comment = await CommentModel.saveObject({
                    object_id: blog_id,
                    object_type: "user_comment",
                    user_id: user.id,
                    since: time(),
                    content: content,
                    last_update: time()
                });

                blog.comment_number = blog.comment_number ? blog.comment_number + 1: 1;
                await blog.edit(["comment_number"]);

                const owner = await UserModel.findByPk(blog.user_id);
                if(owner.is(ROLES.DEVELOPER)){
                    const day = getExactDayNow();
                    await user.updateRecord({
                        type: RECORD_TYPE.COMMENT,
                        day: day,
                        value: 1
                    })
                }
                
                await blog.onComment(comment, user,[owner]);

                FirebaseFunctions.init().saveComment(comment,user);
                return res.status(200).send({
                    comment: comment.release(),
                    code: BaseError.Code.SUCCESS
                });

            } catch (error) {
                console.log("ERROR",error);
                return res.status(200).send(new BaseError("Some errors occurred!", BaseError.Code.ERROR).release());
            }
        })
    )
};