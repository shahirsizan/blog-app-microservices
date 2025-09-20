import { google, GoogleApis } from "googleapis";
import "dotenv/config";

const GOOGLE_CLIENT_ID = process.env.Google_Client_Id;
const GOOGLE_CLIENT_SECRET = process.env.Google_Client_Secret;

export const oauth2client = new google.auth.OAuth2({
	clientId: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	redirectUri: "postmessage",
});
