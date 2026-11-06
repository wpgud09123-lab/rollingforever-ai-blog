import { NextRequest, NextResponse } from 'next/server';
import { newSession, validPassword } from '../../../lib/server';
export async function POST(req: NextRequest) {
  try {
    const {password} = await req.json();
    if (typeof password !== 'string' || !validPassword(password)) return NextResponse.json({error:'비밀번호가 올바르지 않습니다.'},{status:401});
    const res = NextResponse.json({ok:true});
    res.cookies.set('rf_session',newSession(),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:604800});
    return res;
  } catch {return NextResponse.json({error:'로그인 실패'},{status:400});}
}
