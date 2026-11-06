import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { db, errorResponse, isAuthenticated, required, unauthorized } from '../../../lib/server';
export async function POST(req:NextRequest){
  if(!await isAuthenticated())return unauthorized();
  try{
    const {customerId,keyword,tone}=await req.json();
    if(typeof customerId!=='string'||typeof keyword!=='string'||!keyword.trim()||keyword.length>150)return Response.json({error:'광고주와 키워드를 확인하세요.'},{status:400});
    const {data:customer,error:customerError}=await db().from('customers').select('*').eq('id',customerId).single();
    if(customerError||!customer)return Response.json({error:'광고주를 찾을 수 없습니다.'},{status:404});
    const client=new OpenAI({apiKey:required('OPENAI_API_KEY')});
    const result=await client.responses.create({model:'gpt-4.1-mini',instructions:'당신은 한국어 광고 블로그 편집자입니다. 제공된 업체 정보만 사실로 취급하세요. 방문 경험, 시공 실적, 후기, 가격, 자격, 효과 등을 지어내지 마세요. 검색 상위 노출을 보장하지 마세요. 제목 추천 5개를 먼저 작성하고, 이어서 자연스러운 소제목을 포함한 네이버 블로그 초안 약 1000~1500자를 작성하세요. 과도한 키워드 반복을 피하고, 검증이 필요한 정보는 [확인 필요]라고 표시하세요. 광고 목적의 글임을 숨기지 마세요.',input:`업체명: ${customer.name}\n업종: ${customer.industry}\n지역: ${customer.region}\n업체 설명: ${customer.details}\n핵심 키워드: ${keyword}\n문체: ${String(tone||'전문적이고 신뢰감 있게').slice(0,100)}`});
    const content=result.output_text;
    if(!content)throw new Error('AI가 글을 생성하지 못했습니다.');
    const {data,error}=await db().from('posts').insert({customer_id:customerId,keyword:keyword.trim(),tone:String(tone||''),content}).select().single();if(error)throw error;
    return Response.json(data);
  }catch(e){return errorResponse(e);}
}
