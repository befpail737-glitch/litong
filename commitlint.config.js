module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // ✨ 新功能
        'fix',      // 🐛 Bug 修复
        'docs',     // 📚 文档更新
        'style',    // 💄 样式修改（不影响代码逻辑）
        'refactor', // ♻️ 代码重构（既不是新功能也不是Bug修复）
        'perf',     // ⚡ 性能优化
        'test',     // 🧪 添加或修改测试
        'build',    // 🔨 构建系统或依赖修改
        'ci',       // 👷 CI/CD 配置修改
        'chore',    // 🔧 其他不修改src或test的修改
        'revert',   // ⏪ 回退提交
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [2, 'always', 'sentence-case'],
    'header-max-length': [2, 'always', 100],
  },
};