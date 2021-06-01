function capitalize(string) {
    if(typeof string !== 'string') return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
};

function clean(text) {
    if (typeof text === "string") {
        return text
          .replace(/`/g, `\`${String.fromCharCode(8203)}`)
          .replace(/@/g, `@${String.fromCharCode(8203)}`)
          .replace(/```/g, '\\`\\`\\`')
          .replace(/(?<=^|[^`])`(?=[^`]|$)/g, '\\`');
      }
      return text;
};

function removeElement(arr, value) {
    let index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
};

function trimArray(arr, maxLen = 10) {
    if (arr.length > maxLen) {
      const len = arr.length - maxLen;
      arr = arr.slice(0, maxLen);
      arr.push(`and **${len}** more...`);
    }
    return arr;
};

function trimStringFromArray(arr, maxLen = 2048, joinChar = '\n') {
    let string = arr.join(joinChar);
    const diff = maxLen - 15; // Leave room for "And ___ more..."
    if (string.length > maxLen) {
      string = string.slice(0, string.length - (string.length - diff)); 
      string = string.slice(0, string.lastIndexOf(joinChar));
      string = string + `\nAnd **${arr.length - string.split('\n').length}** more...`;
    }
    return string;
};

function getRange(arr, current, interval) {
    const max = (arr.length > current + interval) ? current + interval : arr.length;
    current = current + 1;
    const range = (arr.length == 1 || arr.length == current || interval == 1) ? `[${current}]` : `[${current} - ${max}]`;
    return range;
};

function getOrdinalNumeral(number) {
    number = number.toString();
    if (number === '11' || number === '12' || number === '13') return number + 'th';
    if (number.endsWith(1)) return number + 'st';
    else if (number.endsWith(2)) return number + 'nd';
    else if (number.endsWith(3)) return number + 'rd';
    else return number + 'th';
};

function getStatus(...args) {
    for (const arg of args) {
      if (!arg) return 'Disabled';
    }
    return 'Enabled';
};

function replaceKeywords(message) {
    if (!message) return message;
    else return message
      .replace(/\?member/g, '`?member`')
      .replace(/\?username/g, '`?username`')
      .replace(/\?tag/g, '`?tag`')
      .replace(/\?size/g, '`?size`');
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    capitalize,
    clean,
    removeElement,
    trimArray,
    trimStringFromArray,
    getRange,
    getOrdinalNumeral,
    getCaseNumber,
    getStatus,
    replaceKeywords,
    sleep,
  };
  