/** Restricted, real teaching formats; unsupported variants fail instead of pretending to render. */
const fail=message=>{throw new TypeError(message);};
const bounded=(value,min,max)=>Number.isInteger(value)&&value>=min&&value<=max?value:fail('整数超出范围');
export function qrVersion1(text,level='L') {
  const parameters={L:[19,7,1],M:[16,10,0],Q:[13,13,3],H:[9,17,2]},settings=parameters[level];
  if(!settings||typeof text!=='string'||!text.length||!/^[\x20-\x7e]+$/.test(text))fail('仅支持非空可打印ASCII及L/M/Q/H纠错级别');
  const [dataCount,eccCount,formatLevel]=settings;
  if(text.length>Math.floor((dataCount*8-12)/8))fail('超出Version 1当前纠错级别容量');
  const bits=[],append=(value,count)=>{for(let bit=count-1;bit>=0;bit--)bits.push((value>>>bit)&1);};
  append(4,4);append(text.length,8);for(const char of text)append(char.charCodeAt(0),8);
  const end=Math.min(4,dataCount*8-bits.length);for(let i=0;i<end;i++)bits.push(0);while(bits.length%8)bits.push(0);
  const data=[];for(let i=0;i<bits.length;i+=8)data.push(bits.slice(i,i+8).reduce((value,bit)=>(value<<1)|bit,0));
  let pad=0;while(data.length<dataCount)data.push(pad++%2?0x11:0xec);
  const exp=Array(512),log=Array(256);let x=1;for(let i=0;i<255;i++){exp[i]=x;log[x]=i;x<<=1;if(x&256)x^=0x11d;}for(let i=255;i<512;i++)exp[i]=exp[i-255];
  const mul=(a,b)=>a&&b?exp[log[a]+log[b]]:0;
  let generator=[1];for(let i=0;i<eccCount;i++){const next=Array(generator.length+1).fill(0);generator.forEach((coefficient,j)=>{next[j]^=coefficient;next[j+1]^=mul(coefficient,exp[i]);});generator=next;}
  const remainder=[...data,...Array(eccCount).fill(0)];for(let i=0;i<dataCount;i++){const factor=remainder[i];if(factor)generator.forEach((coefficient,j)=>{remainder[i+j]^=mul(coefficient,factor);});}
  const codewords=[...data,...remainder.slice(dataCount)],matrix=Array.from({length:21},()=>Array(21).fill(null));
  function finder(row,column){for(let dy=-1;dy<=7;dy++)for(let dx=-1;dx<=7;dx++){const r=row+dy,c=column+dx;if(r<0||c<0||r>=21||c>=21)continue;matrix[r][c]=dy>=0&&dy<=6&&dx>=0&&dx<=6&&(dy===0||dy===6||dx===0||dx===6||(dy>=2&&dy<=4&&dx>=2&&dx<=4));}}
  finder(0,0);finder(0,14);finder(14,0);for(let i=8;i<13;i++){matrix[6][i]=i%2===0;matrix[i][6]=i%2===0;}
  const formatData=formatLevel<<3;let bch=formatData<<10;
  const degree=value=>value?32-Math.clz32(value):0;while(degree(bch)>=degree(0x537))bch^=0x537<<(degree(bch)-degree(0x537));
  const format=((formatData<<10)|bch)^0x5412;
  for(let i=0;i<15;i++){const bit=!!((format>>i)&1);matrix[i<6?i:i<8?i+1:21-15+i][8]=bit;matrix[8][i<8?20-i:i<9?7:14-i]=bit;}
  matrix[13][8]=true;let row=20,direction=-1,bitIndex=0;
  for(let column=20;column>0;column-=2){if(column===6)column--;for(;;){for(let offset=0;offset<2;offset++){const col=column-offset;if(matrix[row][col]!==null)continue;const value=((codewords[Math.floor(bitIndex/8)]>>(7-bitIndex%8))&1)===1;matrix[row][col]=(row+col)%2===0?!value:value;bitIndex++;}row+=direction;if(row<0||row>=21){row-=direction;direction=-direction;break;}}}
  if(bitIndex!==208)throw new Error('QR placement invariant failed');
  return {version:1,level,mask:0,size:21,quietZone:4,matrix};
}
const code39Patterns={'0':'bsbSBsBsb','1':'BsbSbsbsB','2':'bsBSbsbsB','3':'BsBSbsbsb','4':'bsbSBsbsB','5':'BsbSBsbsb','6':'bsBSBsbsb','7':'bsbSbsBsB','8':'BsbSbsBsb','9':'bsBSbsBsb','A':'BsbsbSbsB','B':'bsBsbSbsB','C':'BsBsbSbsb','D':'bsbsBSbsB','E':'BsbsBSbsb','F':'bsBsBSbsb','G':'bsbsbSBsB','H':'BsbsbSBsb','I':'bsBsbSBsb','J':'bsbsBSBsb','K':'BsbsbsbSB','L':'bsBsbsbSB','M':'BsBsbsbSb','N':'bsbsBsbSB','O':'BsbsBsbSb','P':'bsBsBsbSb','Q':'bsbsbsBSB','R':'BsbsbsBSb','S':'bsBsbsBSb','T':'bsbsBsBSb','U':'BSbsbsbsB','V':'bSBsbsbsB','W':'BSBsbsbsb','X':'bSbsBsbsB','Y':'BSbsBsbsb','Z':'bSBsBsbsb','-':'bSbsbsBsB','.':'BSbsbsBsb',' ':'bSBsbsBsb','*':'bSbsBsBsb','$':'bSbSbSbsb','/':'bSbSbsbSb','+':'bSbsbSbSb','%':'bsbSbSbSb'};
export function barcode39(text,checksum=true) {
  const alphabet='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%';if(typeof text!=='string'||text.length<1||text.length>12||[...text].some(char=>!alphabet.includes(char))||typeof checksum!=='boolean')fail('Code39仅支持1–12个大写白名单字符');
  const check=checksum?alphabet[[...text].reduce((sum,char)=>sum+alphabet.indexOf(char),0)%43]:'';
  const encoded='*'+text+check+'*';let modules='0'.repeat(10);
  [...encoded].forEach((char,index)=>{if(index)modules+='0';[...code39Patterns[char]].forEach((part,i)=>{modules+=(i%2?'0':'1').repeat(part===part.toUpperCase()?3:1);});});modules+='0'.repeat(10);
  return {type:'Code39',text,checksum:check,encoded,modules};
}
export function parseTeachingPdf(source) {
  if(typeof source!=='string'||source.length>20000||!source.startsWith('%PDF-1.4')||/\/Filter|\/Encrypt|\/JavaScript|\/Launch/.test(source))fail('仅支持本例未压缩、无脚本的ASCII文本PDF1.4');
  const objects=new Map([...source.matchAll(/(\d+) 0 obj\s*([\s\S]*?)endobj/g)].map(match=>[Number(match[1]),match[2]]));
  if(objects.size<4||objects.size>30)fail('PDF对象数量无效');const pages=[];
  for(const body of objects.values()) {
    if(!/\/Type\s*\/Page\b/.test(body))continue;
    const media=body.match(/\/MediaBox\s*\[0 0 (\d+) (\d+)\]/),content=body.match(/\/Contents\s+(\d+) 0 R/);
    if(!media||!content)fail('页面必须有直接MediaBox及单一内容流');const stream=objects.get(Number(content[1]))?.match(/stream\r?\n([\s\S]*?)\r?\nendstream/);
    if(!stream)fail('内容流缺失');const width=bounded(Number(media[1]),1,1000),height=bounded(Number(media[2]),1,1000),texts=[];
    let x=0,y=0,size=12;const token=/\bBT\b|\bET\b|\/F1\s+(\d+)\s+Tf|(-?\d+)\s+(-?\d+)\s+Td|\(((?:\\.|[^\\)])*)\)\s*Tj/g;
    let match,last=0;while((match=token.exec(stream[1]))){if(stream[1].slice(last,match.index).trim())fail('PDF包含未支持的绘制指令');last=token.lastIndex;if(match[1])size=bounded(Number(match[1]),1,72);else if(match[2]!==undefined){x+=Number(match[2]);y+=Number(match[3]);}else if(match[4]!==undefined){const text=match[4].replace(/\\([\\()])/g,'$1');if(!/^[\x20-\x7e]{0,120}$/.test(text))fail('仅支持有限ASCII文本');texts.push({x,y,size,text});}}
    if(stream[1].slice(last).trim()||texts.length>30)fail('PDF内容不在教学子集内');pages.push({width,height,texts,text:texts.map(line=>line.text).join('\n')});
  }
  if(!pages.length||pages.length>5)fail('PDF页数无效');return {pages,count:pages.length};
}
export function crc32(bytes) {let crc=0xffffffff;for(const byte of bytes){crc^=byte;for(let i=0;i<8;i++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}return (crc^0xffffffff)>>>0;}
export function readStoredZip(bytes) {
  if(!(bytes instanceof Uint8Array)||bytes.length>65536||bytes.length<22)fail('ZIP仅支持最多64KiB的字节数组');
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),files=new Map(),decode=new TextDecoder('utf-8',{fatal:true});let offset=0;
  while(offset+4<=bytes.length&&view.getUint32(offset,true)===0x04034b50) {
    if(offset+30>bytes.length)fail('ZIP头部被截断');const flags=view.getUint16(offset+6,true),method=view.getUint16(offset+8,true),crc=view.getUint32(offset+14,true),compressed=view.getUint32(offset+18,true),size=view.getUint32(offset+22,true),nameSize=view.getUint16(offset+26,true),extraSize=view.getUint16(offset+28,true);
    if((flags&~0x800)||method!==0||compressed!==size||size>16384||nameSize>160)fail('仅支持无加密、无压缩store方法的有限ZIP');
    const dataStart=offset+30+nameSize+extraSize,end=dataStart+size;if(end>bytes.length||dataStart>bytes.length)fail('ZIP长度越界');const name=decode.decode(bytes.slice(offset+30,offset+30+nameSize));
    if(!name||name.startsWith('/')||name.includes('..')||name.includes('\\')||files.has(name))fail('ZIP路径无效或重复');const data=bytes.slice(dataStart,end);if(crc32(data)!==crc)fail('ZIP CRC校验失败');files.set(name,decode.decode(data));if(files.size>20)fail('ZIP项目过多');offset=end;
  }
  if(!files.size||view.getUint32(offset,true)!==0x02014b50)fail('ZIP缺少中央目录');return files;
}
const unescapeXml=text=>text.replace(/&(amp|lt|gt|quot|apos);/g,(_,entity)=>({amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"}[entity]));
export function parseTeachingOffice(bytes,type) {
  const files=readStoredZip(bytes);if([...files.values()].some(xml=>/<!DOCTYPE|<!ENTITY/i.test(xml)))fail('不允许DTD或实体声明');
  if(type==='docx') {const xml=files.get('word/document.xml');if(!xml)fail('缺少DOCX正文');const paragraphs=[...xml.matchAll(/<w:p(?:\s[^>]*)?>([\s\S]*?)<\/w:p>/g)].map(match=>[...match[1].matchAll(/<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g)].map(item=>unescapeXml(item[1])).join(''));if(!paragraphs.length)fail('没有受支持的DOCX段落');return {type,paragraphs,text:paragraphs.join('\n')};}
  if(type!=='xlsx')fail('仅支持DOCX/XLSX教学子集');const workbook=files.get('xl/workbook.xml'),rels=files.get('xl/_rels/workbook.xml.rels');if(!workbook||!rels)fail('缺少工作簿或关系');
  const relationships=new Map([...rels.matchAll(/<Relationship\b([^>]*?)\/?\s*>/g)].map(match=>[match[1].match(/\bId="([^"]+)"/)?.[1],match[1].match(/\bTarget="([^"]+)"/)?.[1]]));
  const sheets=[];for(const match of workbook.matchAll(/<sheet\b([^>]*?)\/?\s*>/g)){
    const name=match[1].match(/\bname="([^"]+)"/)?.[1],rid=match[1].match(/r:id="([^"]+)"/)?.[1],target=relationships.get(rid);if(!name||!target||target.includes('..')||target.startsWith('/'))fail('工作表关系无效');const xml=files.get('xl/'+target);if(!xml||/<f\b|<v[^>]*>[^<]{120}/.test(xml))fail('工作表缺失或包含不支持的公式');const rows=[];
    for(const row of xml.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {const cells=[];for(const cell of row[1].matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)){const address=cell[1].match(/\br="([A-H])\d+"/);if(!address)fail('单元格地址超出A-H');const column=address[1].charCodeAt(0)-65;while(cells.length<column)cells.push('');const inline=cell[2].match(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/),number=cell[2].match(/<v>([^<]+)<\/v>/);if(inline)cells[column]=unescapeXml(inline[1]);else if(number&&/^-?\d+(\.\d+)?$/.test(number[1]))cells[column]=Number(number[1]);else fail('只支持inlineStr及有限数值单元格');}rows.push(cells);if(rows.length>20)fail('最多20行');}
    sheets.push({name:unescapeXml(name),rows});if(sheets.length>4)fail('最多4个工作表');
  }
  if(!sheets.length)fail('没有工作表');return {type,sheets};
}
