module.exports = {
  ci: {
    collect: {
      staticDistDir: './public',
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-byte-weight': ['error', { maxNumericValue: 614400 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
