import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';
import { createClient } from '@supabase/supabase-js';

export const required = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} 환경변수가 없습니다.`);
  return value;
};
const sign = (value: string) => createHmac('sha256', required('SESSION_SECRET')).update(value).digest('hex');
export const validPassword = (password: string) => {
  const expected = Buffer.from(sign(required('STAFF_PASSWORD')),'hex');
  const received = Buffer.from(sign(password),'hex');
  return timingSafeEqual(expected,received);
};
export const isAuthenticated = async () => {
  const token = (await cookies()).get('rf_session')?.value;
  if (!token) return false;
  const [expires, signature] = token.split('.');
  if (!expires || !signature || !/^\d+$/.test(expires) || Number(expires) < Date.now()) return false;
  const expected = Buffer.from(sign(expires),'hex');
  const received = Buffer.from(signature,'hex');
  return expected.length === received.length && timingSafeEqual(expected,received);
};
export const newSession = () => {
  const expires = String(Date.now()+7*24*60*60*1000);
  return `${expires}.${sign(expires)}`;
};
export const db = () => createClient(required('SUPABASE_URL'),required('SUPABASE_SERVICE_ROLE_KEY'),{auth:{persistSession:false}});
export const unauthorized = () => Response.json({error:'로그인이 필요합니다.'},{status:401});
export const errorResponse = (error: unknown) => Response.json({error:error instanceof Error?error.message:'요청 실패'},{status:500});
