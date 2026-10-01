import posts from '../../../../src/content/posts';
export function GET(_request:Request,{params}:{params:{id:string}}){const post=posts.find(value=>value.id===params.id);return post?Response.json(post):Response.json({error:'Article not found'},{status:404});}
