import fetch from 'node-fetch'
import * as cheerio from 'cheerio';
import fs from 'fs'
import url from 'url'
import mime from 'mime-types';

// 下载图标并保存到本地
async function downloadIcon(iconUrl) {
  const response = await fetch(iconUrl);
  const arrayBuffer = await response.arrayBuffer(); // 获取 ArrayBuffer
  const buffer = Buffer.from(arrayBuffer); // 转换为 Buffer

  const contentType = response.headers.get('content-type');
  const extension = mime.extension(contentType); // 使用 mime-types 自动确定扩展名
  const fileName = `public/icon_${new URL(iconUrl).hostname}.${extension}`;

  fs.writeFileSync(fileName, buffer); // 写入文件
  console.log(`Icon downloaded and saved as ${fileName}`);
}

// 获取网站的icon
async function getFavicon(websiteUrl) {
  try {
    // 获取网页内容
    const response = await fetch(websiteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
      }
    });
    const body = await response.text();
    // console.log('body---', body)

    // 解析HTML，查找<link>标签中的favicon
    const $ = cheerio.load(body);
    let iconUrl = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href');
    const description = $('meta[name="description"]').attr('content') || '';
    // 如果未找到favicon，则设置默认路径
    if (!iconUrl) {
      console.log('No favicon found, using default /favicon.ico');
      iconUrl = '/favicon.ico';
    }

    // 如果路径是相对路径，转换为绝对路径
    iconUrl = url.resolve(websiteUrl, iconUrl);

    await downloadIcon(iconUrl);
    return {
      iconUrl,
      description
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// 示例使用
const websiteUrl = 'https://ai-bot.cn/'; // 这里替换成你想要下载icon的网站地址
getFavicon(websiteUrl);