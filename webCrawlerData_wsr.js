import axios from "axios";
import { load } from "cheerio";
import { writeFile } from "fs/promises";

const title = "02"; //系列號 只需要 title OS{title}/R{title}-{n}

//抓補充包
async function scrapeCardInfo(n) {
  try {
    const url = `https://ws-rose.com/cardlist/?cardno=OS${title}/R${title}-${n}`;
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      },
    });
    const $ = load(html);

    //判斷是否有該卡號
    const cardId = pdd('dt:contains("カード番号")');
    if (!cardId) {
      return null;
    }

    //dd 裏的 p
    function pdd(target) {
      return $(target).next("dd").find("p").html();
    }

    //卡名 去除span的片假名
    const cardName = $(".item-Heading").contents().not("span").text().trim();

    //魂刻
    const soul = String(
      $('dt:contains("ソウル")').next("dd").find("img").length
    );

    const effect =
      $('dt:contains("テキスト")').next("dd").find("p").html() || "";
    const effectList = effect
      .replace(/<br\s*\/?>/gi, "\n") // <br> 換成換行
      .trim()
      .split("\n") // 按換行分割
      .filter((line) => line.trim() !== ""); // 過濾掉空白行

    //回傳資料 到def
    return {
      id: cardId,
      name: cardName,
      picture: `https://ws-rose.com${$(".thumbnail-Inner img").attr("src")}`,
      color: $('dt:contains("色")').next("dd").find("img").attr("alt"),
      lvl: pdd('dt:contains("レベル")'),
      cost: pdd('dt:contains("コスト")'),
      atk: pdd('dt:contains("パワー")'),
      soul: soul,
      effect: effectList,
    };
  } catch (e) {
    return null;
  }
}

// 抓預組
async function scrapeCardTdInfo(n) {
  try {
    const url = `https://ws-rose.com/cardlist/?cardno=OS${title}/R${title}-T${n}`;
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      },
    });

    const $ = load(html);
    //判斷是否有該卡號
    const cardId = pdd('dt:contains("カード番号")');
    if (!cardId) {
      return null;
    }

    //dd 裏的 p
    function pdd(target) {
      return $(target).next("dd").find("p").html();
    }

    //卡名 去除span的片假名
    const cardName = $(".item-Heading").contents().not("span").text().trim();

    //魂刻
    const soul = String(
      $('dt:contains("ソウル")').next("dd").find("img").length
    );

    const effect =
      $('dt:contains("テキスト")').next("dd").find("p").html() || "";
    const effectList = effect
      .replace(/<br\s*\/?>/gi, "\n") // <br> 換成換行
      .trim()
      .split("\n") // 按換行分割
      .filter((line) => line.trim() !== ""); // 過濾掉空白行

    //回傳資料 到def
    return {
      id: cardId,
      name: cardName,
      picture: `https://ws-rose.com${$(".thumbnail-Inner img").attr("src")}`,
      color: $('dt:contains("色")').next("dd").find("img").attr("alt"),
      lvl: pdd('dt:contains("レベル")'),
      cost: pdd('dt:contains("コスト")'),
      atk: pdd('dt:contains("パワー")'),
      soul: soul,
      effect: effectList,
    };
  } catch (e) {
    return null;
  }
}

//抓PR
async function scrapeCardPrInfo(n) {
  try {
    const url = `https://ws-rose.com/cardlist/?cardno=OS${title}/R${title}-P${n}`;
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      },
    });
    const $ = load(html);

    //判斷是否有該卡號
    const cardId = pdd('dt:contains("カード番号")');
    if (!cardId) {
      return null;
    }

    //dd 裏的 p
    function pdd(target) {
      return $(target).next("dd").find("p").html();
    }

    //卡名 去除span的片假名
    const cardName = $(".item-Heading").contents().not("span").text().trim();

    //魂刻
    const soul = String(
      $('dt:contains("ソウル")').next("dd").find("img").length
    );

    const effect =
      $('dt:contains("テキスト")').next("dd").find("p").html() || "";
    const effectList = effect
      .replace(/<br\s*\/?>/gi, "\n") // <br> 換成換行
      .trim()
      .split("\n") // 按換行分割
      .filter((line) => line.trim() !== ""); // 過濾掉空白行

    //回傳資料 到def
    return {
      id: cardId,
      name: cardName,
      picture: `https://ws-rose.com${$(".thumbnail-Inner img").attr("src")}`,
      color: $('dt:contains("色")').next("dd").find("img").attr("alt"),
      lvl: pdd('dt:contains("レベル")'),
      cost: pdd('dt:contains("コスト")'),
      atk: pdd('dt:contains("パワー")'),
      soul: soul,
      effect: effectList,
    };
  } catch (e) {
    return null;
  }
}

//資料存cards轉Json 更改系列到上 title
async function scrapeAllCards() {
  const cards = [];
  console.log("start");

  for (let i = 1; ; i++) {
    const padded = String(i).padStart(3, "0");
    const card = await scrapeCardInfo(padded);
    if (!card) break;
    cards.push(card);
  }

  for (let i = 1; ; i++) {
    const padded = String(i).padStart(2, "0");
    const card = await scrapeCardTdInfo(padded);
    if (!card) break;
    cards.push(card);
  }

  for (let i = 1; ; i++) {
    const padded = String(i).padStart(2, "0");
    const card = await scrapeCardPrInfo(padded);
    if (!card) break;
    cards.push(card);
  }

  await writeFile(`os${title}.json`, JSON.stringify(cards, null, 2));
  console.log("done");
}

scrapeAllCards();
