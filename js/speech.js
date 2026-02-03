// 语音发音系统
class SpeechSystem {
    constructor() {
        // 检查浏览器是否支持语音合成
        this.supported = 'speechSynthesis' in window;
        this.synthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.voice = null;

        if (this.supported) {
            this.init();
        } else {
            console.warn('浏览器不支持语音合成功能');
        }
    }

    init() {
        // 等待语音列表加载
        if (this.synthesis.getVoices().length === 0) {
            this.synthesis.addEventListener('voiceschanged', () => {
                this.loadVoice();
            });
        } else {
            this.loadVoice();
        }
    }

    // 加载英语语音
    loadVoice() {
        const voices = this.synthesis.getVoices();

        // 优先选择英语语音，按优先级排序
        const preferredVoices = [
            'Google US English',
            'Microsoft David - English (United States)',
            'Microsoft Zira - English (United States)',
            'Alex',
            'Samantha',
            'Karen'
        ];

        // 尝试找到首选语音
        for (const preferred of preferredVoices) {
            const found = voices.find(voice => voice.name === preferred);
            if (found) {
                this.voice = found;
                console.log('使用语音:', found.name);
                return;
            }
        }

        // 如果没找到首选，使用第一个英语语音
        this.voice = voices.find(voice =>
            voice.lang.startsWith('en-')
        ) || voices[0];

        console.log('使用语音:', this.voice ? this.voice.name : '默认');
    }

    // 朗读单词
    speak(word, options = {}) {
        if (!this.supported) {
            console.warn('语音合成不可用');
            return;
        }

        // 停止当前正在播放的语音
        this.stop();

        // 创建语音对象
        this.currentUtterance = new SpeechSynthesisUtterance(word);

        // 设置语音参数
        this.currentUtterance.lang = 'en-US';
        this.currentUtterance.rate = options.rate || 0.9; // 语速稍慢，便于学习
        this.currentUtterance.pitch = options.pitch || 1.0; // 音调
        this.currentUtterance.volume = options.volume || 1.0; // 音量

        // 如果找到了合适的语音，使用它
        if (this.voice) {
            this.currentUtterance.voice = this.voice;
        }

        // 添加事件监听
        this.currentUtterance.onstart = () => {
            if (options.onStart) options.onStart();
        };

        this.currentUtterance.onend = () => {
            if (options.onEnd) options.onEnd();
        };

        this.currentUtterance.onerror = (event) => {
            console.error('语音合成错误:', event);
            if (options.onError) options.onError(event);
        };

        // 播放语音
        this.synthesis.speak(this.currentUtterance);
    }

    // 停止当前语音
    stop() {
        if (this.supported && this.synthesis.speaking) {
            this.synthesis.cancel();
        }
    }

    // 暂停语音
    pause() {
        if (this.supported && this.synthesis.speaking) {
            this.synthesis.pause();
        }
    }

    // 恢复语音
    resume() {
        if (this.supported && this.synthesis.paused) {
            this.synthesis.resume();
        }
    }

    // 检查是否正在播放
    isSpeaking() {
        return this.supported && this.synthesis.speaking;
    }

    // 朗读单词（带中文翻译，可选）
    speakWithTranslation(word, chineseTranslation = null, delay = 800) {
        this.speak(word.english || word, {
            onEnd: () => {
                if (chineseTranslation) {
                    // 短暂延迟后朗读中文
                    setTimeout(() => {
                        this.speak(chineseTranslation, {
                            lang: 'zh-CN',
                            rate: 1.0
                        });
                    }, delay);
                }
            }
        });
    }

    // 获取可用的语音列表
    getAvailableVoices() {
        if (!this.supported) return [];
        return this.synthesis.getVoices().filter(voice =>
            voice.lang.startsWith('en-')
        );
    }

    // 设置语音
    setVoice(voiceName) {
        const voices = this.synthesis.getVoices();
        const voice = voices.find(v => v.name === voiceName);
        if (voice) {
            this.voice = voice;
            console.log('切换到语音:', voice.name);
            return true;
        }
        return false;
    }

    // 测试发音
    test() {
        const testWords = ['cat', 'dog', 'apple', 'hello'];
        const randomWord = testWords[Math.floor(Math.random() * testWords.length)];
        this.speak(randomWord);
    }
}

// 创建全局语音系统实例
const speechSystem = new SpeechSystem();
