// UPSTASH
//////////////////////
import { createClient } from "redis";

export const redisClient = createClient({
	url: "rediss://default:AStzAAIncDJkZWU1NjU1YzRiMTk0NTZlODcxYzYxMzk5MGRhODlmZnAyMTExMjM@direct-quail-11123.upstash.io:6379",
});
