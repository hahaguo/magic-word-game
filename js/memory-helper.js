// 记忆辅助系统
class MemoryHelper {
    constructor() {
        this.vowels = ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U'];
    }

    // 将单词中的元音和辅音用颜色标注
    highlightVowelsConsonants(word) {
        return word.split('').map(letter => {
            if (this.vowels.includes(letter)) {
                return `<span class="vowel">${letter}</span>`;
            } else if (letter.match(/[a-zA-Z]/)) {
                return `<span class="consonant">${letter}</span>`;
            } else {
                return letter;
            }
        }).join('');
    }

    // 显示助记弹窗
    showMemoryPopup(word) {
        const popup = document.getElementById('memoryPopup');
        const content = document.getElementById('memoryContent');

        let html = `
            <div class="memory-popup-header">
                <div class="word-title">
                    <span class="word-emoji">${word.emoji}</span>
                    <span class="word-english">${word.english}</span>
                    <span class="word-phonetic">${word.phonetic}</span>
                </div>
                <button class="close-popup-btn" onclick="memoryHelper.closePopup()">✕</button>
            </div>
            <div class="memory-sections">
        `;

        // 元音辅音分析
        html += `
            <div class="memory-section">
                <div class="section-title">🔤 元音辅音</div>
                <div class="vowel-consonant-display">
                    ${this.highlightVowelsConsonants(word.english)}
                </div>
                <div class="section-tip">
                    <span class="vowel">●</span> 元音字母 (a, e, i, o, u)
                    <span class="consonant">●</span> 辅音字母
                </div>
            </div>
        `;

        // 助记词
        if (word.mnemonic) {
            html += `
                <div class="memory-section">
                    <div class="section-title">💡 趣味记忆</div>
                    <div class="mnemonic-text">${word.mnemonic}</div>
                </div>
            `;
        }

        // 例句
        if (word.example) {
            html += `
                <div class="memory-section">
                    <div class="section-title">📝 例句</div>
                    <div class="example-english">${word.example.en}</div>
                    <div class="example-chinese">${word.example.zh}</div>
                </div>
            `;
        }

        // 词根词缀
        if (word.wordStructure) {
            html += `
                <div class="memory-section">
                    <div class="section-title">🔍 词汇分析</div>
                    <div class="word-structure">${word.wordStructure}</div>
                </div>
            `;
        }

        html += `</div>`;
        html += `
            <button class="know-it-btn" onclick="memoryHelper.closePopup()">
                我记住了！💪
            </button>
        `;

        content.innerHTML = html;
        popup.classList.add('show');
    }

    // 关闭弹窗
    closePopup() {
        const popup = document.getElementById('memoryPopup');
        popup.classList.remove('show');
    }

    // 获取元音辅音统计
    getVowelConsonantStats(word) {
        const letters = word.toLowerCase().split('').filter(c => c.match(/[a-z]/));
        const vowelCount = letters.filter(c => this.vowels.includes(c)).length;
        const consonantCount = letters.length - vowelCount;

        return {
            total: letters.length,
            vowels: vowelCount,
            consonants: consonantCount,
            vowelLetters: letters.filter(c => this.vowels.includes(c)),
            consonantLetters: letters.filter(c => !this.vowels.includes(c))
        };
    }

    // 格式化显示统计
    formatStats(word) {
        const stats = this.getVowelConsonantStats(word);
        return `
            共${stats.total}个字母：
            <span class="vowel">${stats.vowels}个元音</span>
            <span class="consonant">${stats.consonants}个辅音</span>
        `;
    }
}

// 创建全局实例
const memoryHelper = new MemoryHelper();
