// 艾宾浩斯记忆曲线系统
class EbbinghausMemorySystem {
    constructor() {
        // 复习间隔（毫秒）- 根据艾宾浩斯记忆曲线
        this.reviewIntervals = [
            5 * 60 * 1000,          // 第1次：5分钟后
            24 * 60 * 60 * 1000,    // 第2次：1天后
            2 * 24 * 60 * 60 * 1000,    // 第3次：2天后
            7 * 24 * 60 * 60 * 1000,    // 第4次：7天后
            15 * 24 * 60 * 60 * 1000,   // 第5次：15天后
            30 * 24 * 60 * 60 * 1000    // 第6次：30天后
        ];

        // 单词掌握等级
        this.masteryLevels = {
            NEW: 0,         // 新单词
            LEARNING: 1,    // 学习中
            FAMILIAR: 2,    // 熟悉
            MASTERED: 3     // 精通
        };

        this.loadData();
    }

    // 从localStorage加载数据
    loadData() {
        const saved = localStorage.getItem('wordMemoryData');
        if (saved) {
            this.memoryData = JSON.parse(saved);
        } else {
            this.memoryData = {};
        }
    }

    // 保存数据到localStorage
    saveData() {
        localStorage.setItem('wordMemoryData', JSON.stringify(this.memoryData));
    }

    // 记录单词学习
    recordWordStudy(word, isCorrect) {
        const wordKey = word.english.toLowerCase();
        const now = Date.now();

        if (!this.memoryData[wordKey]) {
            // 新单词
            this.memoryData[wordKey] = {
                word: word,
                firstStudyTime: now,
                lastStudyTime: now,
                nextReviewTime: now + this.reviewIntervals[0],
                reviewCount: 0,
                correctCount: 0,
                wrongCount: 0,
                masteryLevel: this.masteryLevels.NEW,
                reviewHistory: []
            };
        }

        const wordData = this.memoryData[wordKey];
        wordData.lastStudyTime = now;
        wordData.reviewCount++;

        // 记录本次学习结果
        wordData.reviewHistory.push({
            time: now,
            correct: isCorrect
        });

        if (isCorrect) {
            wordData.correctCount++;
            // 正确则推进到下一个复习间隔
            const nextIntervalIndex = Math.min(
                wordData.reviewCount,
                this.reviewIntervals.length - 1
            );
            wordData.nextReviewTime = now + this.reviewIntervals[nextIntervalIndex];
        } else {
            wordData.wrongCount++;
            // 错误则回退到较短的复习间隔
            const resetIntervalIndex = Math.max(0, wordData.reviewCount - 2);
            wordData.nextReviewTime = now + this.reviewIntervals[resetIntervalIndex];
        }

        // 更新掌握等级
        this.updateMasteryLevel(wordData);

        this.saveData();
    }

    // 更新单词掌握等级
    updateMasteryLevel(wordData) {
        const accuracy = wordData.correctCount / (wordData.correctCount + wordData.wrongCount);
        const reviewCount = wordData.reviewCount;

        if (reviewCount >= 6 && accuracy >= 0.9) {
            wordData.masteryLevel = this.masteryLevels.MASTERED;
        } else if (reviewCount >= 3 && accuracy >= 0.7) {
            wordData.masteryLevel = this.masteryLevels.FAMILIAR;
        } else if (reviewCount > 0) {
            wordData.masteryLevel = this.masteryLevels.LEARNING;
        } else {
            wordData.masteryLevel = this.masteryLevels.NEW;
        }
    }

    // 获取需要复习的单词
    getWordsToReview() {
        const now = Date.now();
        const wordsToReview = [];

        for (const wordKey in this.memoryData) {
            const wordData = this.memoryData[wordKey];
            if (wordData.nextReviewTime <= now &&
                wordData.masteryLevel < this.masteryLevels.MASTERED) {
                wordsToReview.push(wordData.word);
            }
        }

        return wordsToReview;
    }

    // 获取推荐学习的单词（混合新词和复习词）
    getRecommendedWords(count = 6) {
        const reviewWords = this.getWordsToReview();
        const newWords = this.getNewWords(count);

        // 策略：70%复习词 + 30%新词
        const reviewCount = Math.floor(count * 0.7);
        const newCount = count - reviewCount;

        const recommended = [];

        // 添加需要复习的单词（优先级最高）
        for (let i = 0; i < reviewCount && i < reviewWords.length; i++) {
            recommended.push(reviewWords[i]);
        }

        // 如果复习词不够，补充新词
        const remainingSlots = count - recommended.length;
        const newWordsToAdd = Math.min(remainingSlots, newWords.length);

        for (let i = 0; i < newWordsToAdd; i++) {
            recommended.push(newWords[i]);
        }

        // 如果还不够，随机选择单词
        if (recommended.length < count) {
            const allWords = wordBank.filter(w =>
                !recommended.find(r => r.english === w.english)
            );
            const shuffled = allWords.sort(() => Math.random() - 0.5);
            const needed = count - recommended.length;
            recommended.push(...shuffled.slice(0, needed));
        }

        return recommended;
    }

    // 获取新单词（未学习过的）
    getNewWords(count) {
        const learnedWords = Object.keys(this.memoryData);
        const newWords = wordBank.filter(word =>
            !learnedWords.includes(word.english.toLowerCase())
        );
        return newWords.sort(() => Math.random() - 0.5).slice(0, count);
    }

    // 获取学习统计
    getStatistics() {
        const stats = {
            totalWords: wordBank.length,
            studiedWords: Object.keys(this.memoryData).length,
            newWords: 0,
            learning: 0,
            familiar: 0,
            mastered: 0,
            needReview: 0,
            accuracy: 0,
            totalReviews: 0,
            correctCount: 0,
            wrongCount: 0
        };

        let totalCorrect = 0;
        let totalWrong = 0;

        for (const wordKey in this.memoryData) {
            const wordData = this.memoryData[wordKey];
            stats.totalReviews += wordData.reviewCount;
            totalCorrect += wordData.correctCount;
            totalWrong += wordData.wrongCount;

            // 统计掌握等级
            switch (wordData.masteryLevel) {
                case this.masteryLevels.NEW:
                    stats.newWords++;
                    break;
                case this.masteryLevels.LEARNING:
                    stats.learning++;
                    break;
                case this.masteryLevels.FAMILIAR:
                    stats.familiar++;
                    break;
                case this.masteryLevels.MASTERED:
                    stats.mastered++;
                    break;
            }

            // 统计需要复习的单词
            if (wordData.nextReviewTime <= Date.now() &&
                wordData.masteryLevel < this.masteryLevels.MASTERED) {
                stats.needReview++;
            }
        }

        stats.correctCount = totalCorrect;
        stats.wrongCount = totalWrong;
        stats.accuracy = totalCorrect + totalWrong > 0
            ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)
            : 0;

        return stats;
    }

    // 获取单词详细信息
    getWordData(word) {
        const wordKey = word.english.toLowerCase();
        return this.memoryData[wordKey] || null;
    }

    // 获取今天的学习目标完成情况
    getTodayProgress() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStart = today.getTime();

        let todayStudied = 0;
        let todayReviewed = 0;

        for (const wordKey in this.memoryData) {
            const wordData = this.memoryData[wordKey];
            if (wordData.lastStudyTime >= todayStart) {
                todayStudied++;
                if (wordData.reviewCount > 1) {
                    todayReviewed++;
                }
            }
        }

        return {
            studied: todayStudied,
            reviewed: todayReviewed,
            target: 20, // 每天目标学习20个单词
            progress: Math.min(Math.round((todayStudied / 20) * 100), 100)
        };
    }

    // 重置某个单词的学习记录
    resetWord(word) {
        const wordKey = word.english.toLowerCase();
        delete this.memoryData[wordKey];
        this.saveData();
    }

    // 清除所有学习数据
    clearAllData() {
        if (confirm('确定要清除所有学习记录吗？此操作不可恢复！')) {
            this.memoryData = {};
            this.saveData();
            return true;
        }
        return false;
    }

    // 导出学习数据
    exportData() {
        const dataStr = JSON.stringify(this.memoryData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `word-memory-data-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // 导入学习数据
    importData(jsonData) {
        try {
            this.memoryData = JSON.parse(jsonData);
            this.saveData();
            return true;
        } catch (e) {
            console.error('导入失败：', e);
            return false;
        }
    }
}

// 创建全局记忆系统实例
const memorySystem = new EbbinghausMemorySystem();
