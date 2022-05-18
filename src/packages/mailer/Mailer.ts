import nodemailer from 'nodemailer';
import { readFile } from '../../services/helper';

interface VariableParams {
    [key: string]: string
}

export default class Mailer{
    static instance;
    public static async init() {
        this.instance = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: process.env.GMAIL_USERNAME,
                pass: process.env.GMAIL_PASSWORD,
            },
        })
    }

    public static async sendMail(receivers: string[], content: string, title: string) {
        try {
            const message = await this.instance.sendMail({
                from: process.env.GMAIL_MAIL,
                to: receivers.join(","),
                subject: title,
                html: content
            });            
            return message;
        }
        catch (e) {
            console.log("ERORR",e)
            return "";
        }
    }

    public static async getMailContent(template_link: string, params: VariableParams) {

        const string_template = await readFile(`src/mail_templates/templates/${template_link}`) as string;
        var message_content = string_template;

        var keys = Object.keys(params);
        for (let i = 0; i < keys.length; i++) {
            message_content = message_content.replace(`{{${keys[i]}}}`, params[keys[i]]);
            message_content = message_content.replace(`{{${keys[i]}}}`, params[keys[i]]);
        }

        return message_content;
    }

}