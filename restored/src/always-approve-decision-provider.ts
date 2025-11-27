/* harmony export */__webpack_require__.d(__webpack_exports__, {
  /* harmony export */I: () => (/* binding */AlwaysApproveDecisionProvider)
  /* harmony export */
});
class AlwaysApproveDecisionProvider {
  requestApproval(_operation) {
    return Promise.resolve({
      approved: true
    });
  }
}

/***/