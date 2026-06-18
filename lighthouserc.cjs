// Lighthouse CI — audits the built static output (dist/) against the performance budget
// (CONVENTIONS § Performance budget). CommonJS (.cjs) because package.json is "type": "module".
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-byte-weight': ['error', { maxNumericValue: 716800 }],
        // JS bundle ceiling (CONVENTIONS): gz app+vendor ≤ 160 KB target / hard fail > 200 KB.
        'resource-summary:script:size': ['error', { maxNumericValue: 204800 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
