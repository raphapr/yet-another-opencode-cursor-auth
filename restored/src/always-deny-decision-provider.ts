/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */N: () => (/* binding */AlwaysDenyDecisionProvider)
  /* harmony export */
});
class AlwaysDenyDecisionProvider {
  requestApproval(_operation) {
    return Promise.resolve({
      approved: false
    });
  }
}

/***/