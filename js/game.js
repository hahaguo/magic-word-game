// 游戏核心逻辑
class WordGame {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.currentMode = null;
        this.currentWords = [];
        this.wordsPerLevel = 6;
        this.currentQuestionIndex = 0;

        // 配对游戏状态
        this.selectedCards = [];
        this.matchedPairs = 0;

        // 拼写游戏状态
        this.currentWord = null;

        // 记忆系统集成
        this.memorySystem = memorySystem;

        // 语音系统集成
        this.speechSystem = speechSystem;

        // 墨墨专属鼓励语
        this.encouragements = {
            correct: [
                '墨墨真棒！',
                '墨墨好厉害！',
                '墨墨答对了！',
                '太棒了墨墨！',
                '墨墨真聪明！',
                '墨墨好优秀！',
                '继续加油墨墨！',
                '墨墨太厉害了！'
            ],
            wrong: [
                '墨墨再想想～',
                '墨墨加油！',
                '没关系墨墨，再试一次！',
                '墨墨可以的！',
                '不要紧墨墨，继续努力！'
            ],
            levelComplete: [
                '墨墨完成这一关啦！太棒了！',
                '墨墨真是个学习小能手！',
                '墨墨又进步了！继续加油！',
                '墨墨越来越厉害了！',
                '墨墨的努力有了回报！',
                '墨墨真是好样的！'
            ]
        };

        this.init();
    }

    init() {
        // 绑定事件
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                if (mode) {
                    this.startGame(mode);
                }
            });
        });

        // 绑定复习按钮
        document.getElementById('reviewBtn').addEventListener('click', () => {
            this.startReviewMode();
        });

        document.getElementById('backBtn').addEventListener('click', () => {
            this.backToHome();
        });

        document.getElementById('submitSpelling').addEventListener('click', () => {
            this.checkSpelling();
        });

        document.getElementById('spellingInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkSpelling();
            }
        });

        document.getElementById('continueBtn').addEventListener('click', () => {
            this.nextLevel();
        });

        document.getElementById('backHomeBtn').addEventListener('click', () => {
            this.backToHome();
        });

        // 绑定学习统计按钮
        document.getElementById('statsBtn')?.addEventListener('click', () => {
            this.showStats();
        });

        // 显示学习提醒
        this.updateLearningReminder();
    }

    // 启动复习模式
    startReviewMode() {
        const reviewWords = this.memorySystem.getWordsToReview();

        if (reviewWords.length === 0) {
            this.showFeedback('🎉', '墨墨太棒了！暂时没有需要复习的单词哦～', 'correct');
            return;
        }

        // 限制每次复习的单词数量
        this.currentWords = reviewWords.slice(0, Math.min(reviewWords.length, 10));

        // 随机选择一个游戏模式
        const modes = ['match', 'spelling', 'choice'];
        const randomMode = modes[Math.floor(Math.random() * modes.length)];

        this.currentMode = randomMode;
        this.currentQuestionIndex = 0;
        this.matchedPairs = 0;
        this.selectedCards = [];

        // 显示游戏区域
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('gameArea').style.display = 'block';

        // 隐藏所有游戏模式
        document.querySelectorAll('.game-mode').forEach(mode => {
            mode.style.display = 'none';
        });

        // 显示当前模式
        switch(randomMode) {
            case 'match':
                document.getElementById('modeTitle').textContent = '📚 复习 - 配对游戏';
                document.getElementById('matchGame').style.display = 'block';
                this.initMatchGame();
                break;
            case 'spelling':
                document.getElementById('modeTitle').textContent = '📚 复习 - 拼写游戏';
                document.getElementById('spellingGame').style.display = 'block';
                this.initSpellingGame();
                break;
            case 'choice':
                document.getElementById('modeTitle').textContent = '📚 复习 - 选择题';
                document.getElementById('choiceGame').style.display = 'block';
                this.initChoiceGame();
                break;
        }

        this.updateProgress();
    }

    startGame(mode) {
        this.currentMode = mode;
        // 使用记忆系统推荐的单词
        this.currentWords = this.memorySystem.getRecommendedWords(this.wordsPerLevel);
        this.currentQuestionIndex = 0;
        this.matchedPairs = 0;
        this.selectedCards = [];

        // 显示游戏区域
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('gameArea').style.display = 'block';

        // 隐藏所有游戏模式
        document.querySelectorAll('.game-mode').forEach(mode => {
            mode.style.display = 'none';
        });

        // 显示当前模式
        switch(mode) {
            case 'match':
                document.getElementById('modeTitle').textContent = '🎯 配对游戏';
                document.getElementById('matchGame').style.display = 'block';
                this.initMatchGame();
                break;
            case 'spelling':
                document.getElementById('modeTitle').textContent = '✏️ 拼写游戏';
                document.getElementById('spellingGame').style.display = 'block';
                this.initSpellingGame();
                break;
            case 'choice':
                document.getElementById('modeTitle').textContent = '🎲 选择题';
                document.getElementById('choiceGame').style.display = 'block';
                this.initChoiceGame();
                break;
        }

        this.updateProgress();
    }

    // 配对游戏
    initMatchGame() {
        const grid = document.getElementById('matchGrid');
        grid.innerHTML = '';
        this.selectedCards = [];
        this.matchedPairs = 0;

        // 创建卡片对（单词+表情符号）
        const cards = [];
        this.currentWords.forEach(word => {
            cards.push({
                type: 'emoji',
                content: word.emoji,
                word: word
            });
            cards.push({
                type: 'text',
                content: word.english,
                word: word
            });
        });

        // 打乱卡片
        cards.sort(() => Math.random() - 0.5);

        // 渲染卡片
        cards.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'match-card';
            cardEl.dataset.index = index;
            cardEl.dataset.wordId = card.word.english;

            if (card.type === 'emoji') {
                cardEl.innerHTML = `
                    <div class="card-emoji">${card.content}</div>
                    <button class="speak-btn" data-word="${card.word.english}">🔊</button>
                    <button class="hint-btn" data-word="${card.word.english}">💡</button>
                `;
            } else {
                cardEl.innerHTML = `
                    <div class="card-text">${card.content}</div>
                    <div class="card-phonetic">${card.word.phonetic || ''}</div>
                    <button class="speak-btn" data-word="${card.word.english}">🔊</button>
                    <button class="hint-btn" data-word="${card.word.english}">💡</button>
                `;
            }

            // 发音按钮事件（阻止冒泡，不触发卡片选择）
            const speakBtn = cardEl.querySelector('.speak-btn');
            speakBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.speechSystem.speak(card.word.english);
            });

            // 提示按钮事件（阻止冒泡，不触发卡片选择）
            const hintBtn = cardEl.querySelector('.hint-btn');
            hintBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                memoryHelper.showMemoryPopup(card.word);
            });

            cardEl.addEventListener('click', () => this.handleCardClick(cardEl, card));
            grid.appendChild(cardEl);
        });
    }

    handleCardClick(cardEl, card) {
        // 如果已经匹配或已选择，忽略
        if (cardEl.classList.contains('matched') || cardEl.classList.contains('selected')) {
            return;
        }

        // 如果已经选择了两张卡片，忽略
        if (this.selectedCards.length >= 2) {
            return;
        }

        cardEl.classList.add('selected');
        this.selectedCards.push({ element: cardEl, card: card });

        if (this.selectedCards.length === 2) {
            setTimeout(() => this.checkMatch(), 600);
        }
    }

    checkMatch() {
        const [first, second] = this.selectedCards;

        if (first.card.word.english === second.card.word.english) {
            // 匹配成功
            first.element.classList.remove('selected');
            second.element.classList.remove('selected');
            first.element.classList.add('matched');
            second.element.classList.add('matched');

            this.matchedPairs++;
            this.score += 10;
            this.updateScore();
            this.showFeedback('🎉', this.getRandomEncouragement('correct'), 'correct');

            // 记录到记忆系统
            this.memorySystem.recordWordStudy(first.card.word, true);

            // 播放单词发音
            setTimeout(() => {
                this.speechSystem.speak(first.card.word.english);
            }, 300);

            // 检查是否完成
            if (this.matchedPairs === this.currentWords.length) {
                setTimeout(() => this.levelComplete(), 1000);
            }
        } else {
            // 匹配失败
            first.element.classList.add('wrong');
            second.element.classList.add('wrong');
            this.showFeedback('😢', this.getRandomEncouragement('wrong'), 'wrong');

            // 记录两个单词都答错
            this.memorySystem.recordWordStudy(first.card.word, false);
            this.memorySystem.recordWordStudy(second.card.word, false);

            setTimeout(() => {
                first.element.classList.remove('selected', 'wrong');
                second.element.classList.remove('selected', 'wrong');
            }, 800);
        }

        this.selectedCards = [];
        this.updateProgress();
    }

    // 拼写游戏
    initSpellingGame() {
        this.currentQuestionIndex = 0;

        // 绑定发音按钮
        const speakBtn = document.getElementById('spellingSpeak');
        speakBtn.addEventListener('click', () => {
            if (this.currentWord) {
                this.speechSystem.speak(this.currentWord.english);
            }
        });

        // 绑定提示按钮
        const hintBtn = document.getElementById('spellingHint');
        hintBtn.addEventListener('click', () => {
            if (this.currentWord) {
                memoryHelper.showMemoryPopup(this.currentWord);
            }
        });

        this.showNextSpellingWord();
    }

    showNextSpellingWord() {
        if (this.currentQuestionIndex >= this.currentWords.length) {
            this.levelComplete();
            return;
        }

        this.currentWord = this.currentWords[this.currentQuestionIndex];
        document.getElementById('spellingImage').textContent = this.currentWord.emoji;
        document.getElementById('spellingHintText').innerHTML = `
            <div class="phonetic-hint">${this.currentWord.phonetic || ''}</div>
        `;
        document.getElementById('spellingInput').value = '';
        document.getElementById('spellingInput').focus();

        this.updateProgress();
    }

    checkSpelling() {
        const input = document.getElementById('spellingInput').value.trim().toLowerCase();
        const correct = this.currentWord.english.toLowerCase();

        if (input === correct) {
            this.score += 15;
            this.updateScore();
            this.showFeedback('🌟', this.getRandomEncouragement('correct'), 'correct');

            // 记录到记忆系统
            this.memorySystem.recordWordStudy(this.currentWord, true);

            // 播放单词发音
            setTimeout(() => {
                this.speechSystem.speak(this.currentWord.english);
            }, 300);

            setTimeout(() => {
                this.currentQuestionIndex++;
                this.showNextSpellingWord();
            }, 1500);
        } else {
            this.showFeedback('❌', `正确答案是：${this.currentWord.english}`, 'wrong');

            // 记录到记忆系统
            this.memorySystem.recordWordStudy(this.currentWord, false);

            // 播放正确答案的发音
            setTimeout(() => {
                this.speechSystem.speak(this.currentWord.english);
            }, 500);

            document.getElementById('spellingInput').value = '';
        }
    }

    // 选择题游戏
    initChoiceGame() {
        this.currentQuestionIndex = 0;

        // 绑定发音按钮
        const speakBtn = document.getElementById('choiceSpeak');
        speakBtn.addEventListener('click', () => {
            if (this.currentQuestionIndex < this.currentWords.length) {
                this.speechSystem.speak(this.currentWords[this.currentQuestionIndex].english);
            }
        });

        // 绑定提示按钮
        const hintBtn = document.getElementById('choiceHint');
        hintBtn.addEventListener('click', () => {
            if (this.currentQuestionIndex < this.currentWords.length) {
                memoryHelper.showMemoryPopup(this.currentWords[this.currentQuestionIndex]);
            }
        });

        this.showNextChoice();
    }

    showNextChoice() {
        if (this.currentQuestionIndex >= this.currentWords.length) {
            this.levelComplete();
            return;
        }

        const currentWord = this.currentWords[this.currentQuestionIndex];
        document.getElementById('choiceImage').textContent = currentWord.emoji;
        document.getElementById('questionText').innerHTML = `
            <div class="phonetic-display">${currentWord.phonetic || ''}</div>
            <div>这个单词是什么？</div>
        `;

        // 生成选项（1个正确 + 3个错误）
        const wrongWords = getRandomWords(3, this.currentWords);
        const options = [currentWord, ...wrongWords].sort(() => Math.random() - 0.5);

        const choicesGrid = document.getElementById('choicesGrid');
        choicesGrid.innerHTML = '';

        options.forEach(word => {
            const btn = document.createElement('button');
            btn.className = 'choice-option';
            btn.textContent = word.english;
            btn.addEventListener('click', () => this.checkChoice(btn, word, currentWord));
            choicesGrid.appendChild(btn);
        });

        this.updateProgress();
    }

    checkChoice(btn, selected, correct) {
        // 禁用所有按钮
        document.querySelectorAll('.choice-option').forEach(b => {
            b.style.pointerEvents = 'none';
        });

        if (selected.english === correct.english) {
            btn.classList.add('correct');
            this.score += 10;
            this.updateScore();
            this.showFeedback('✨', this.getRandomEncouragement('correct'), 'correct');

            // 记录到记忆系统
            this.memorySystem.recordWordStudy(correct, true);

            // 播放单词发音
            setTimeout(() => {
                this.speechSystem.speak(correct.english);
            }, 300);

            setTimeout(() => {
                this.currentQuestionIndex++;
                this.showNextChoice();
            }, 1500);
        } else {
            btn.classList.add('wrong');
            this.showFeedback('💭', `正确答案是：${correct.english}`, 'wrong');

            // 记录到记忆系统
            this.memorySystem.recordWordStudy(correct, false);

            // 播放正确答案的发音
            setTimeout(() => {
                this.speechSystem.speak(correct.english);
            }, 500);

            // 显示正确答案
            document.querySelectorAll('.choice-option').forEach(b => {
                if (b.textContent === correct.english) {
                    setTimeout(() => b.classList.add('correct'), 500);
                }
            });

            setTimeout(() => {
                this.currentQuestionIndex++;
                this.showNextChoice();
            }, 2500);
        }
    }

    // 更新进度条
    updateProgress() {
        let progress = 0;

        switch(this.currentMode) {
            case 'match':
                progress = (this.matchedPairs / this.currentWords.length) * 100;
                break;
            case 'spelling':
            case 'choice':
                progress = (this.currentQuestionIndex / this.currentWords.length) * 100;
                break;
        }

        document.getElementById('progressFill').style.width = progress + '%';
    }

    // 更新分数
    updateScore() {
        document.getElementById('score').textContent = this.score;
    }

    // 显示反馈
    showFeedback(icon, message, type) {
        const popup = document.getElementById('feedbackPopup');
        document.getElementById('feedbackIcon').textContent = icon;
        document.getElementById('feedbackMessage').textContent = message;

        popup.classList.add('show');

        setTimeout(() => {
            popup.classList.remove('show');
        }, 1500);
    }

    // 关卡完成
    levelComplete() {
        const stars = this.calculateStars();
        const encouragement = this.getRandomEncouragement('levelComplete');

        document.getElementById('completeMessage').textContent =
            `墨墨在这一关获得了 ${this.score} 分！`;

        let starsHtml = '';
        for (let i = 0; i < 3; i++) {
            starsHtml += i < stars ? '⭐' : '☆';
        }
        document.getElementById('starsDisplay').innerHTML = starsHtml;

        // 更新鼓励语
        document.getElementById('encouragement').textContent = encouragement;

        document.getElementById('levelCompletePopup').style.display = 'block';
    }

    calculateStars() {
        // 根据分数计算星星数
        const scoreThreshold = this.wordsPerLevel * 10;
        if (this.score >= scoreThreshold * 1.5) return 3;
        if (this.score >= scoreThreshold) return 2;
        return 1;
    }

    // 获取随机鼓励语
    getRandomEncouragement(type) {
        const messages = this.encouragements[type];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    // 下一关
    nextLevel() {
        this.level++;
        document.getElementById('level').textContent = this.level;
        document.getElementById('levelCompletePopup').style.display = 'none';

        // 增加难度：更多单词
        if (this.level % 3 === 0) {
            this.wordsPerLevel = Math.min(this.wordsPerLevel + 2, 12);
        }

        this.startGame(this.currentMode);
    }

    // 返回首页
    backToHome() {
        document.getElementById('gameArea').style.display = 'none';
        document.getElementById('levelCompletePopup').style.display = 'none';
        document.getElementById('welcomeScreen').style.display = 'block';

        // 重置游戏状态
        this.currentMode = null;
        this.currentQuestionIndex = 0;
        this.matchedPairs = 0;
        this.selectedCards = [];

        // 更新学习提醒
        this.updateLearningReminder();
    }

    // 更新学习提醒
    updateLearningReminder() {
        const stats = this.memorySystem.getStatistics();
        const reviewWords = this.memorySystem.getWordsToReview();
        const todayProgress = this.memorySystem.getTodayProgress();

        // 更新复习按钮描述
        const reviewDesc = document.getElementById('reviewDesc');
        if (reviewDesc) {
            if (reviewWords.length > 0) {
                reviewDesc.textContent = `有 ${reviewWords.length} 个单词需要复习`;
                // 给复习按钮添加高亮样式
                document.getElementById('reviewBtn')?.classList.add('has-review');
            } else {
                reviewDesc.textContent = '暂时没有需要复习的单词';
                document.getElementById('reviewBtn')?.classList.remove('has-review');
            }
        }

        // 更新今日进度
        const progressEl = document.getElementById('todayProgress');
        if (progressEl) {
            progressEl.textContent = `今日已学：${todayProgress.studied}/${todayProgress.target}个单词`;
        }

        // 更新复习提醒
        const reminderEl = document.getElementById('reviewReminder');
        if (reminderEl) {
            if (reviewWords.length > 0) {
                reminderEl.textContent = `📚 有 ${reviewWords.length} 个单词需要复习`;
                reminderEl.style.display = 'block';
            } else {
                reminderEl.style.display = 'none';
            }
        }

        // 更新统计数字
        const statsEl = document.getElementById('quickStats');
        if (statsEl) {
            statsEl.innerHTML = `
                <span>📖 已学：${stats.studiedWords}/${stats.totalWords}</span>
                <span>⭐ 精通：${stats.mastered}</span>
                <span>🎯 正确率：${stats.accuracy}%</span>
            `;
        }
    }

    // 显示详细统计
    showStats() {
        const stats = this.memorySystem.getStatistics();
        const statsPopup = document.getElementById('statsPopup');

        if (statsPopup) {
            const content = `
                <div class="stats-content">
                    <h2>📊 墨墨的学习统计</h2>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-value">${stats.studiedWords}</div>
                            <div class="stat-label">已学单词</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${stats.mastered}</div>
                            <div class="stat-label">精通单词</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${stats.accuracy}%</div>
                            <div class="stat-label">正确率</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${stats.needReview}</div>
                            <div class="stat-label">待复习</div>
                        </div>
                    </div>
                    <div class="mastery-breakdown">
                        <h3>墨墨的掌握程度</h3>
                        <div class="mastery-bar">
                            ${stats.studiedWords > 0 ? `
                            <div class="mastery-segment mastered" style="width: ${(stats.mastered/stats.studiedWords*100)}%">
                                ${stats.mastered > 0 ? '精通 ' + stats.mastered : ''}
                            </div>
                            <div class="mastery-segment familiar" style="width: ${(stats.familiar/stats.studiedWords*100)}%">
                                ${stats.familiar > 0 ? '熟悉 ' + stats.familiar : ''}
                            </div>
                            <div class="mastery-segment learning" style="width: ${(stats.learning/stats.studiedWords*100)}%">
                                ${stats.learning > 0 ? '学习中 ' + stats.learning : ''}
                            </div>
                            ` : '<div class="no-data">墨墨还没有开始学习哦～</div>'}
                        </div>
                    </div>

                    <!-- 数据备份和恢复区域 -->
                    <div class="backup-section">
                        <h3>💾 数据备份与恢复</h3>
                        <div class="backup-buttons">
                            <button class="backup-btn" onclick="game.exportData()">
                                <span class="btn-icon">📥</span>
                                <span>导出学习数据</span>
                            </button>
                            <button class="backup-btn" onclick="game.importData()">
                                <span class="btn-icon">📤</span>
                                <span>导入学习数据</span>
                            </button>
                            <button class="backup-btn danger" onclick="game.clearAllData()">
                                <span class="btn-icon">🗑️</span>
                                <span>清除所有数据</span>
                            </button>
                        </div>
                        <div class="backup-note">
                            💡 提示：定期备份数据，防止数据丢失。导出的数据可以在其他设备上导入恢复。
                        </div>
                    </div>

                    <button class="close-stats-btn" onclick="game.closeStats()">关闭</button>
                </div>
            `;
            statsPopup.innerHTML = content;
            statsPopup.style.display = 'block';
        }
    }

    // 关闭统计面板
    closeStats() {
        const statsPopup = document.getElementById('statsPopup');
        if (statsPopup) {
            statsPopup.style.display = 'none';
        }
    }

    // 导出学习数据
    exportData() {
        try {
            const data = {
                version: '2.2',
                exportDate: new Date().toISOString(),
                memoryData: this.memorySystem.memoryData,
                totalWords: Object.keys(this.memorySystem.memoryData).length
            };

            const dataStr = JSON.stringify(data, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');

            const fileName = `墨墨的学习数据_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.json`;
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showFeedback('✅', `数据导出成功！已学习 ${data.totalWords} 个单词`, 'correct');
        } catch (error) {
            console.error('导出失败:', error);
            this.showFeedback('❌', '导出数据失败，请重试', 'wrong');
        }
    }

    // 导入学习数据
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);

                    // 验证数据格式
                    if (!data.memoryData) {
                        throw new Error('数据格式不正确');
                    }

                    // 询问用户是否覆盖现有数据
                    const currentWords = Object.keys(this.memorySystem.memoryData).length;
                    const importWords = Object.keys(data.memoryData).length;

                    let message = `将要导入 ${importWords} 个单词的学习记录`;
                    if (currentWords > 0) {
                        message += `\n当前已有 ${currentWords} 个单词的学习记录`;
                        message += '\n\n⚠️ 导入将会覆盖现有数据！';
                        message += '\n建议先导出当前数据备份';
                    }
                    message += '\n\n是否继续导入？';

                    if (confirm(message)) {
                        this.memorySystem.memoryData = data.memoryData;
                        this.memorySystem.saveData();

                        this.showFeedback('✅', `成功导入 ${importWords} 个单词的学习记录！`, 'correct');

                        // 刷新显示
                        this.updateLearningReminder();
                        this.closeStats();

                        // 延迟后重新打开统计页面显示新数据
                        setTimeout(() => {
                            this.showStats();
                        }, 2000);
                    }
                } catch (error) {
                    console.error('导入失败:', error);
                    this.showFeedback('❌', '导入数据失败，文件格式可能不正确', 'wrong');
                }
            };

            reader.onerror = () => {
                this.showFeedback('❌', '读取文件失败，请重试', 'wrong');
            };

            reader.readAsText(file);
        };

        input.click();
    }

    // 清除所有数据
    clearAllData() {
        const currentWords = Object.keys(this.memorySystem.memoryData).length;

        if (currentWords === 0) {
            this.showFeedback('💡', '当前没有学习数据', 'correct');
            return;
        }

        const message = `⚠️ 警告：此操作将清除所有学习记录！\n\n` +
                       `当前已学习 ${currentWords} 个单词\n` +
                       `所有学习进度、复习记录都将被删除\n\n` +
                       `建议先导出数据备份！\n\n` +
                       `确定要清除所有数据吗？`;

        if (confirm(message)) {
            // 二次确认
            if (confirm('真的要清除吗？此操作不可恢复！')) {
                this.memorySystem.memoryData = {};
                this.memorySystem.saveData();

                this.showFeedback('✅', '所有学习数据已清除', 'correct');

                // 刷新显示
                this.updateLearningReminder();
                this.closeStats();
            }
        }
    }
}

// 初始化游戏
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new WordGame();
});
