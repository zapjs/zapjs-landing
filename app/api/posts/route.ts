import posts from '../../../src/content/posts';
export function GET(request:Request){
 const query=new URL(request.url).searchParams;
 const page=Number(query.get('page')??1),limit=Number(query.get('limit')??5),tag=query.get('tag');
 if(!Number.isSafeInteger(page)||page<1||!Number.isSafeInteger(limit)||limit<1||limit>50) return Response.json({error:'page must be positive; limit must be between 1 and 50'},{status:400});
 const filtered=tag?posts.filter(post=>post.tags.includes(tag)):posts;
 const pages=Math.ceil(filtered.length/limit);
 return Response.json({posts:filtered.slice((page-1)*limit,page*limit).map(({paragraphs,...summary})=>summary),pagination:{page,limit,total:filtered.length,pages,hasNext:page<pages,hasPrev:page>1}});
}
