// 比較項目定義
// 最終更新: 2026-05-09

export interface ComparisonCategory {
  id: string;
  name: string;
  color: string; // テーマカラー
  description: string;
}

export interface ComparisonCriterion {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  evaluationMethod: string;
  isCatalogSpec: boolean; // 基本カタログスペックかどうか
}

export const categories: ComparisonCategory[] = [
  {
    id: 'catalog',
    name: '基本スペック',
    color: '#3B82F6', // Blue
    description: 'ツールの基本情報',
  },
  {
    id: 'features',
    name: '機能・性能',
    color: '#10B981', // Green
    description: 'コア機能と性能評価',
  },
  {
    id: 'integration',
    name: '統合・互換性',
    color: '#8B5CF6', // Purple
    description: 'IDEやワークフローとの統合度',
  },
  {
    id: 'pricing',
    name: '価格・コスト',
    color: '#F59E0B', // Orange
    description: '料金体系とコスト効率',
  },
  {
    id: 'community',
    name: 'コミュニティ',
    color: '#EC4899', // Pink
    description: 'サポート、ドキュメント、エコシステム',
  },
];

export const criteria: ComparisonCriterion[] = [
  // 基本スペック
  {
    id: 'toolName',
    categoryId: 'catalog',
    name: 'ツール名',
    description: 'ツールの正式名称',
    evaluationMethod: '名称',
    isCatalogSpec: true,
  },
  {
    id: 'officialUrl',
    categoryId: 'catalog',
    name: '公式サイトURL',
    description: '公式サイトのURL',
    evaluationMethod: 'URL',
    isCatalogSpec: true,
  },
  {
    id: 'description',
    categoryId: 'catalog',
    name: '概要説明',
    description: 'ツールの簡単な説明',
    evaluationMethod: 'テキスト',
    isCatalogSpec: true,
  },
  {
    id: 'pricingModel',
    categoryId: 'catalog',
    name: '価格モデル',
    description: '無料/有料/両方の区分',
    evaluationMethod: '区分',
    isCatalogSpec: true,
  },
  {
    id: 'isOpenSource',
    categoryId: 'catalog',
    name: 'オープンソース有無',
    description: 'OSSとして公開されているか',
    evaluationMethod: '有無',
    isCatalogSpec: true,
  },
  {
    id: 'supportedIDEs',
    categoryId: 'catalog',
    name: '対応IDE',
    description: '対応するIDE/エディタ',
    evaluationMethod: 'リスト',
    isCatalogSpec: true,
  },
  {
    id: 'supportedModels',
    categoryId: 'catalog',
    name: '対応LLMモデル',
    description: '利用可能なLLMモデル',
    evaluationMethod: 'リスト',
    isCatalogSpec: true,
  },
  {
    id: 'releaseYear',
    categoryId: 'catalog',
    name: 'リリース年',
    description: '初期リリース年',
    evaluationMethod: '年',
    isCatalogSpec: true,
  },
  {
    id: 'developer',
    categoryId: 'catalog',
    name: '開発元/コミュニティ',
    description: '開発元企業またはコミュニティ',
    evaluationMethod: 'テキスト',
    isCatalogSpec: true,
  },
  {
    id: 'primaryUseCase',
    categoryId: 'catalog',
    name: '主な利用シーン',
    description: '主要な利用シーン',
    evaluationMethod: 'テキスト',
    isCatalogSpec: true,
  },

  // 機能・性能
  {
    id: 'autoCompletionAccuracy',
    categoryId: 'features',
    name: '自動補完の精度',
    description: '次に書くコードの予測の正確さ、文脈追従性',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },
  {
    id: 'codeGenerationAccuracy',
    categoryId: 'features',
    name: 'コード生成の正確性',
    description: '指示どおりに動くコードを生成できるか',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },
  {
    id: 'refactoringSupport',
    categoryId: 'features',
    name: 'リファクタリング支援能力',
    description: '既存コードの構造改善、命名変更、抽象化提案の質',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },
  {
    id: 'bugFixSupport',
    categoryId: 'features',
    name: 'バグ修正支援能力',
    description: 'エラー原因の特定と修正案の妥当性',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },
  {
    id: 'longContextUnderstanding',
    categoryId: 'features',
    name: '長文コンテキスト理解',
    description: '大きなファイルや複数ファイル間の依存関係の把握',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },
  {
    id: 'multiFileEditing',
    categoryId: 'features',
    name: 'マルチファイル編集能力',
    description: '関連箇所を漏れなく一括変更できるか',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },
  {
    id: 'testGeneration',
    categoryId: 'features',
    name: 'テスト生成能力',
    description: '単体・統合テストを適切に作れるか',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },
  {
    id: 'agentTaskExecution',
    categoryId: 'features',
    name: 'エージェント的タスク遂行能力',
    description: '調査→修正→検証まで一連で進められるか',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },
  {
    id: 'responseSpeed',
    categoryId: 'features',
    name: '応答速度',
    description: '生成開始までと完了までの時間',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },
  {
    id: 'highLoadStability',
    categoryId: 'features',
    name: '高負荷時の安定性',
    description: '混雑時や長時間利用時の失敗率',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },
  {
    id: 'outputConsistency',
    categoryId: 'features',
    name: '出力の一貫性',
    description: '同条件での回答ブレの少なさ',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },
  {
    id: 'hallucinationRate',
    categoryId: 'features',
    name: '幻覚の少なさ',
    description: '存在しないAPI・機能・挙動を断定しないか',
    evaluationMethod: '5段階評価（高い=幻覚が少ない）',
    isCatalogSpec: false,
  },

  // 統合・互換性
  {
    id: 'ideIntegrationDepth',
    categoryId: 'integration',
    name: 'IDE統合の深さ',
    description: '補完、差分適用、診断、ナビゲーションとの連携度',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },
  {
    id: 'workflowIntegration',
    categoryId: 'integration',
    name: 'ワークフロー統合性',
    description: 'Git、CI、Issue、ターミナル、レビューとの連携',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },
  {
    id: 'projectUnderstanding',
    categoryId: 'integration',
    name: 'プロジェクト構成理解',
    description: 'リポジトリの規約、アーキテクチャ、命名に沿えるか',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },
  {
    id: 'customizability',
    categoryId: 'integration',
    name: 'カスタマイズ性・拡張性',
    description: 'プロンプト、ルール、プラグイン、APIでどこまで拡張できるか',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },
  {
    id: 'modelFlexibility',
    categoryId: 'integration',
    name: 'モデル/エンジンの切替柔軟性',
    description: '用途別にモデルを選べるか、固定か',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },

  // 価格・コスト
  {
    id: 'pricingPredictability',
    categoryId: 'pricing',
    name: '価格の予測可能性',
    description: '利用量に対して請求が読めるか',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },
  {
    id: 'freeTierUsability',
    categoryId: 'pricing',
    name: '無料枠の実用性',
    description: '無料でどこまで継続利用できるか',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },

  // コミュニティ
  {
    id: 'communityMaturity',
    categoryId: 'community',
    name: 'コミュニティ成熟度',
    description: '利用者数、事例、拡張、フォーラム活性',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },
  {
    id: 'documentationQuality',
    categoryId: 'community',
    name: 'ドキュメント品質',
    description: '使い方、制限、API、例示の明確さ',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },
  {
    id: 'supportResponsiveness',
    categoryId: 'community',
    name: 'サポート応答性',
    description: '問い合わせへの対応速度と質',
    evaluationMethod: '5段階評価',
    isCatalogSpec: false,
  },
];

// カテゴリ別の基準取得
export function getCriteriaByCategory(categoryId: string): ComparisonCriterion[] {
  return criteria.filter(c => c.categoryId === categoryId);
}

// 基本スペック以外の基準取得
export function getEvaluationCriteria(): ComparisonCriterion[] {
  return criteria.filter(c => !c.isCatalogSpec);
}

// カテゴリ取得
export function getCategoryById(categoryId: string): ComparisonCategory | undefined {
  return categories.find(c => c.id === categoryId);
}
