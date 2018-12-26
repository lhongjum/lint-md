export default class Text {
  constructor(text) {
    // 存储文本的二维数组
    this.texts = this.toTextArray(text);
  }

  toTextArray(text) {
    return text.split('\n').map(line => line.split(''));
  }

  /**
   * 删除某一行
   * @param line
   * @return {Text}
   */
  removeLine(line) {
    this.texts.splice(line - 1, 1);
    return this;
  }

  /**
   * 插入一行行内文本
   * @param line
   * @param text
   */
  insertLine(line, text) {
    this.texts.splice(line - 1, 0, text.split(''));
    return this;
  }

  /**
   * 从某一个位置切断行
   * @param line
   * @param column
   * @return {Text}
   */
  cutLine(line, column) {
    const lineText = this.texts[line - 1];
    this.texts[line - 1] = lineText.slice(0, column - 1);
    // 插入一行
    this.insertLine(line + 1, lineText.slice(column - 1).join(''));

    return this;
  }

  /**
   * 合并 line 和 line + 1 行
   * @param line
   */
  mergeLine(line) {
    const targetLine = this.texts[line - 1];
    const sourceLine  = this.texts[line];
    // 合并到 line - 1 行
    targetLine.splice(targetLine.length, 0, ...sourceLine);

    // 删除 line 行
    this.removeLine(line + 1);

    return this;
  }

  /**
   * 删除 start-end 位置文本
   * @param start
   * @param end
   */
  removeBlock(start, end) {
    const { line: startLine, column: startColumn } = start;
    const { line: endLine, column: endColumn } = end;

    if (startLine === endLine) {
      // 删除这几个字符
      this.texts[startLine - 1].splice(startColumn - 1, endColumn - startColumn);

      return this;
    }

    let len = endLine - startLine;

    for (let i = 0; i <= len; i ++) {
      const curr = i + startLine;

      if (i === 0) {
        this.texts[curr - 1] = this.texts[curr - 1].slice(0, startColumn - 1);
      } else if (i === len) {
        this.texts[curr - 1] = this.texts[curr - 1].slice(endColumn - 1);
      } else {
        this.removeLine(curr);
        // 删除了一行，偏移调整一下
        -- i;
        -- len;
      }
    }

    // 合并
    this.mergeLine(startLine);

    return this;
  }

  /**
   * 在 line:column 处插入文本
   * @param line
   * @param column
   * @param block
   */
  insertBlock(line, column, block) {
    const texts = this.toTextArray(block);
    const len = texts.length;

    this.cutLine(line, column);

    // 循环处理
    texts.forEach((text, idx) => {
      if (idx === 0) {
        // 第一行追加
        this.texts[line - 1 + idx].splice(column - 1, 0, ...text);
      } else if (idx === len - 1) {
        // 最后一行，追加到前面
        this.texts[line - 1 + idx].splice(0, 0, ...text);
      } else {
        // 其余的插入进去
        this.insertLine(line + idx, text.join(''));
      }
    });

    return this;
  }

  /**
   * 最终的结果
   * @return {string}
   */
  result() {
    return this.texts.map(line => line.join('')).join('\n');
  }
}