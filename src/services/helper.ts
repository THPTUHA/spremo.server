import fs from 'fs';
import { BLOG_TYPES, DRAFT, EMOTIONS, FRIEND, PRIVATE, PUBLIC, SHARE_OPTIONS } from '../Constants';
import { BlogModel } from '../models/blog/blog';
import { MapTagModal } from '../models/map.tag/map.tag';
import { TagModal } from '../models/tag/tag';
import cloudinary_handle from '../packages/cloudinary/cloudinary';
export function generateCode(value: string) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '_');
};

export const time = function () {
    return Math.floor(new Date().getTime() / 1000);
};

export const readFile = function (path: string) {
    return new Promise((resolve, reject) => {
       try {
            const res = fs.readFileSync(path, 'utf8');
            resolve(res);
       } catch (error) {
            reject(error);
       }
    });
}

export function wrapAsync(fn) {
    return function (req, res, next) {
        // Make sure to `.catch()` any errors and pass them along to the `next()`
        // middleware in the chain, in this case the error handler.
        fn(req, res, next).catch(next);
    };
}

export function wrapSocket(fn){
    return function(socket){
        fn(socket);
    }
}

export function getEmotion(id: number){
    id = castToNumber(id) ;
    id = id ? id : 0;
    for(let i = 0; i < EMOTIONS.length ; ++ i){
        if(EMOTIONS[i].id ==  id) return EMOTIONS[i];
    }
    return EMOTIONS[0];
}

export function castToNumber(num: any){
    if(typeof num == "number"){
        return num;
    }

    if(typeof num == "string"){
        num = parseInt(num);
        return num == NaN ? 0 : num;
    }

    return 0;
}

export function isValidStatus(status: number){
    return status == PRIVATE || status == PUBLIC || status == DRAFT || status == FRIEND
}

export function isValidBlogType(type: number){
    const keys = Object.keys(BLOG_TYPES);
    for(const i in keys){
        if(BLOG_TYPES[keys[i]] == type) return type;
    }
    return 0;
}


export function isValidShareOption(share_option_id: number){
    for(const share of SHARE_OPTIONS){
        if(share.id == share_option_id){
            return true;
        }
    }
    return false;
}


export async function uploadFile(file: any,name?:string, type?: string ) {
    let uploadLocation = __dirname + file.originalname;
    fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(file.buffer)) );
    const config :any= {
        upload_preset: 'emotion',
    }
    if(name){
        config.public_id = name
    }

    if(type){
        config.resource_type = type;
    }
    const uploadResponse = await cloudinary_handle.uploader.upload(uploadLocation, config);

    fs.unlink(uploadLocation, (deleteErr) => {
        console.log('File was deleted');
    });

    return uploadResponse;
}

export function convertArrayToIndex(arr: string | number[]){
    let index = "";
    if(typeof arr == 'string'){
        arr = JSON.parse(arr);
        for(let i = 0; i< arr.length ; ++i){
            index += arr[i] + "#";
        }
    }else{
        for(let i = 0; i< arr.length ; ++i){
            index += arr[i] + "#";
        }
    }
    return index;
}

export function getExactDayNow(){
    const day = new Date();
    const time  = Math.floor(day.getTime()/1000);
    return time - day.getHours()*3600 - day.getMinutes()*60 - day.getSeconds();
}

export async function updateOneTag({tag, user_id, blog}:{tag: string, user_id: number, blog: BlogModel}) {
    let tag_exist = await TagModal.findOne({
        where:{name: tag}
    })
    if(!tag_exist){
        tag_exist = await TagModal.saveObject({
            name: tag,
            user_id: user_id,
            created_time: time()
        })
    }else{
        await MapTagModal.destroy({
            where:{
                blog_id: blog.id
            }
        })
    } 
    await MapTagModal.saveObject({
        blog_id: blog.id,
        hash_key: MapTagModal.setHashKey(tag,blog.status,user_id,blog.id ),
        tag_id: tag_exist.id
    })    
}

export async function updateManyTag({tags, user_id, blog}:{tags: string[], user_id: number, blog: BlogModel}) {
    console.log("Tags.....",tags );
    let list_tag = await TagModal.findAll({
        where:{name: tags}
    })
    const tags_nonexist = [];
    for(let i = 0 ;i< tags.length ;++i){
        let check = false;
        for(let j = 0; j < list_tag.length ; ++j){
            if(tags[i] == list_tag[j].name){
                check = true;
                break;
            }
        }
        if(!check){
            tags_nonexist.push(tags[i])
        }
    }

     for(let i = 0; i < tags_nonexist.length ; ++i){
        const tag = await TagModal.saveObject({
            name: tags_nonexist[i],
            user_id: user_id,
            created_time: time()
        })

        list_tag.push(tag);
    }
    if(list_tag.length){
        await MapTagModal.destroy({
            where:{
                blog_id: blog.id
            }
        })
   }
   console.log("LIST_TAGS------",list_tag);
   for(let i=0; i< list_tag.length ;++i){
        await MapTagModal.saveObject({
            blog_id: blog.id,
            hash_key: MapTagModal.setHashKey(list_tag[i].name,blog.status,user_id,blog.id ),
            tag_id: list_tag[i].id
        })   
    }   
}