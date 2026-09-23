export class SubmissionError extends Error {}
export const MAX_ARTICLE_BYTES = 64_000
export const template = `/publish
Title: Your article headline
Slug: your-article-headline
Category: institutions
Summary: A short, accurate summary of the article.
Period: The event date or period covered
Takeaway: The main point readers should remember.
Image: official-portrait

Body:
## What happened
Write your original article here in complete paragraphs. Include at least 60 words across the article. Use additional ## headings to organize the story. Attribute claims and distinguish announcements from verified results.

## Why it matters
Add useful context for readers and explain what the evidence supports. The bot publishes the text you provide; it does not research or invent missing facts.

Sources:
Source title | https://example.com/source | Source date or access date`

export function slugify(value: string) {
 return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
export function richText(paragraphs: string[]) {
 return { root: { type: 'root', version: 1, format: '' as const, indent: 0, direction: null, children: paragraphs.map(text => ({type:'paragraph',version:1,format:'',indent:0,direction:null,children:[{type:'text',version:1,text,format:0,detail:0,mode:'normal',style:''}]})) } }
}
export function parseArticle(input: string) {
 if (new TextEncoder().encode(input).length > MAX_ARTICLE_BYTES) throw new SubmissionError('Article exceeds 64 KB. Send a shorter .txt file.')
 const text = input.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim()
 const command = text.match(/^\/(publish|draft)(?:@TunjiOjoJournalBot)?\s*\n/i)
 if (!command) throw new SubmissionError('Start with /publish or /draft on its own line. Use /template for the format.')
 const bodyMarker = text.indexOf('\nBody:\n')
 const sourcesMarker = text.lastIndexOf('\nSources:\n')
 if (bodyMarker < 0 || sourcesMarker <= bodyMarker) throw new SubmissionError('Include Body: and Sources: on separate lines, in that order.')
 const headers: Record<string,string> = {}
 const allowed = new Set(['title','slug','category','summary','period','takeaway','image','author','imagedescription','imagecredit','imagesource','imagerights'])
 for (const line of text.slice(command[0].length, bodyMarker).split('\n').filter(v=>v.trim())) {
  const match = line.match(/^([A-Za-z]+):\s*(.+)$/)
  if (!match || !allowed.has(match[1].toLowerCase())) throw new SubmissionError('Unknown header. Use Title, Slug, Category, Summary, Period, Takeaway, Image, optional Author, ImageDescription, ImageCredit, ImageSource and ImageRights.')
  const key=match[1].toLowerCase()
  if (headers[key]) throw new SubmissionError(`Use ${match[1]} only once.`)
  headers[key]=match[2].trim()
 }
 for (const [key,max] of [['title',160],['summary',320],['category',80],['period',200],['takeaway',600]] as const) {
  if (!headers[key] || headers[key].length>max) throw new SubmissionError(`${key} is required and must be at most ${max} characters.`)
 }
 if (!headers.image) throw new SubmissionError('Image is required. Use /images for an archive ID, or Image: attached with a photo and its image details.')
 if(headers.image==='attached') {
  for(const key of ['imagedescription','imagecredit','imagesource','imagerights']) if(!headers[key] || headers[key].length>2000) throw new SubmissionError(`${key} is required for attached photos (maximum 2000 characters).`)
  try {const url=new URL(headers.imagesource);if(url.protocol!=='https:' || url.username || url.password)throw Error()}catch{throw new SubmissionError('ImageSource must be a complete HTTPS link.')}
 }
 const slug = headers.slug || slugify(headers.title)
 if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length>140) throw new SubmissionError('Slug must be lowercase words separated by hyphens, at most 140 characters.')
 const body=text.slice(bodyMarker+7,sourcesMarker).trim()
 if (body.split(/\s+/).length<60) throw new SubmissionError('Body needs at least 60 words. Send the complete article, not just a headline.')
 const sections: {heading:string;anchor:string;paragraphs:string[]}[]=[]
 for (const part of body.split(/^##\s+/m).filter(Boolean)) {
  const lines=part.trim().split('\n')
  const heading=body.startsWith('## ') || sections.length>0 ? lines.shift()!.trim() : 'The story'
  const paragraphs=lines.join('\n').trim().split(/\n\s*\n/).map(p=>p.replace(/\n/g,' ').trim()).filter(Boolean)
  if (!heading || heading.length>160 || !paragraphs.length) throw new SubmissionError('Each ## heading needs a paragraph beneath it.')
  sections.push({heading,anchor:`section-${sections.length+1}-${slugify(heading).slice(0,60) || 'story'}`,paragraphs})
 }
 if (!sections.length || sections.length>20) throw new SubmissionError('Use between 1 and 20 article sections.')
 const sources=text.slice(sourcesMarker+10).trim().split('\n').filter(v=>v.trim()).map(line=>{
  const parts=line.split('|').map(v=>v.trim())
  if(parts.length!==3 || !parts[0] || !parts[2]) throw new SubmissionError('Each source must be: Source title | https://... | Date')
  try { const url=new URL(parts[1]); if(url.protocol!=='https:' || url.username || url.password || !url.hostname.includes('.') || url.hostname==='example.com') throw new Error() } catch { throw new SubmissionError('Sources need real, complete HTTPS links without usernames or passwords.') }
  if(parts[0].length>250 || parts[1].length>2000 || parts[2].length>100) throw new SubmissionError('A source entry is too long.')
  return {title:parts[0],url:parts[1],date:parts[2]}
 })
 if (!sources.length || sources.length>20) throw new SubmissionError('Include between 1 and 20 sources.')
 return { mode:command[1].toLowerCase() as 'publish'|'draft',title:headers.title,slug,category:slugify(headers.category),excerpt:headers.summary,period:headers.period,takeaway:headers.takeaway,image:headers.image,imageDetails:headers.image==='attached'?{alt:headers.imagedescription,credit:headers.imagecredit,source:headers.imagesource,rights:headers.imagerights}:undefined,author:headers.author||'editorial-desk',sections,sources }
}
