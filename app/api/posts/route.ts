import { db, errorResponse, isAuthenticated, unauthorized } from '../../../lib/server';
export async function GET(){if(!await isAuthenticated())return unauthorized();try{const {data,error}=await db().from('posts').select('*,customers(name)').order('created_at',{ascending:false}).limit(100);if(error)throw error;return Response.json(data);}catch(e){return errorResponse(e);}}
