import { generateCode } from "../../services/helper";

export default class Valid {
	public static email(text: string): boolean {
		var tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
		if (!text) return false;

		if (text.length > 256) return false;

		if (!tester.test(text)) return false;

		var textParts = text.split('@');
		var account = textParts[0];
		var address = textParts[1];
		if (account.length > 64) return false;

		var domainParts = address.split('.');
		if (domainParts.some(function (part) {
			return part.length > 63;
		})) return false;

		return true;
	}

	public static string(value: string | null, max_length: number = 0){
		if (!value){
			return false;
		}

		if (value.length && max_length && value.length > max_length) {
			return false;
		}

		return !/^\s*$/.test(value);
	}

	public static isNumber(value: string | number) {
		//@ts-ignore
        return parseInt(value)? true : false
	}

	public static isUserName(value: string) {
		if (generateCode(value) != value) {
			return false;
		}

		return true;
	}

}