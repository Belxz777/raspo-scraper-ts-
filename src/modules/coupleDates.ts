import { fetchHTML, parseTable } from "./total";
import axios from 'axios';
import * as fs from 'fs';
import * as cheerio from 'cheerio';
import { next } from "cheerio/dist/commonjs/api/traversing";
async function coupleDates(
  date1: string, date2: string,
month:string
) {
    const probel = '%20'
    let url:string;
    let html;
    url = `https://www.pilot-ipek.ru/raspo/${date1},${probel}${date2}${probel}${month}`;
    console.log(url)
    html = await fetchHTML(url);
    if (!html) {
        console.error("Повторная ошибка пожалуйста проверьте правильность ввода")
        return {
            status :"ошибка пожалуйста проверьте правильность ввода"
        }  
    }
    const $ = cheerio.load(html);
    const schedule1day = [];
    const schedule2day = [];
    let nextday  = false
    $('table').each((tableIndex, table) => {
        if(!nextday) {
        const tableData = parseTable(table);
        schedule1day.push(...tableData);
        } else {
            const tableData = parseTable(table);
            schedule2day.push(...tableData);
        }
        nextday = !nextday
        console.log(tableIndex,"индекс");
    });
    fs.writeFileSync(`data/schedule${date1}${month}.json`, JSON.stringify(schedule1day, null, 2));
    fs.writeFileSync(`data/schedule${date2}${month}.json`, JSON.stringify(schedule2day, null, 2));
    return {
        status:200,
        details:"Кейс отыгран , информация записана"
    }
    // console.log({status:200,details:`Отправлено полное расписание  за ${date1} ${month}`}) 
    // fs.writeFileSync(`data/schedule${date1}${month}.json`, JSON.stringify(schedule, null, 2));      
    // return schedule;

}
export {coupleDates}
