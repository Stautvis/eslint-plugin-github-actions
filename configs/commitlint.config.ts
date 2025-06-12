import { RuleConfigSeverity, type UserConfig } from '@commitlint/types'

const configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  formatter: '@commitlint/format',
  rules: {
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      ['feat', 'fix', 'docs', 'test', 'ci', 'chore', 'release', 'revert'],
    ],
    'subject-case': [RuleConfigSeverity.Error, 'always', 'sentence-case'],
    'references-empty': [RuleConfigSeverity.Error, 'never'],
  },
}

export default configuration
