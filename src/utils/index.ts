/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  // eslint-disable-next-line guard-for-in
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

/**
 * @description: 随机密码
 * @param {*} len 密码位数
 * @param {*} mode 密码难度：hide(大小写数字特殊字符)、medium(大小写数字)、low(小写数字)
 */
export const randomPwd = function (len = 16, mode = 'high') {
  const lowerCaseArr = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];
  const blockLetterArr = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  const numberArr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const specialArr = ['!', '@', '-', '_', '=', '<', '>', '#', '*', '%', '+', '&', '^', '$'];
  const passArr = [];
  let password = '';

  const specifyRandom = function (...arr: (string | number)[][]) {
    let str = '';
    arr.forEach((item) => {
      str += item[Math.floor(Math.random() * item.length)];
    });
    return str;
  };

  switch (mode) {
    case 'high':
      //安全最高的
      password += specifyRandom(lowerCaseArr, blockLetterArr, numberArr, specialArr);
      passArr.push(...lowerCaseArr, ...blockLetterArr, ...numberArr, ...specialArr);
      break;
    case 'medium':
      //中等的
      password += specifyRandom(lowerCaseArr, blockLetterArr, numberArr);
      passArr.push(...lowerCaseArr, ...blockLetterArr, ...numberArr);
      break;
    //低等的
    case 'low':
      password += specifyRandom(lowerCaseArr, numberArr);
      passArr.push(...lowerCaseArr, ...numberArr);
      break;
    default:
      password += specifyRandom(lowerCaseArr, numberArr);
      passArr.push(...lowerCaseArr, ...numberArr);
  }

  const forLen = len - password.length;
  for (let i = 0; i < forLen; i++) {
    password += specifyRandom(passArr);
  }

  return password;
};
