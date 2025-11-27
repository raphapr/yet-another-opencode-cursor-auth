/* unused harmony exports formatTimestamp, getTimeCategory, getStatusIcon, getStatusColor, getSourceText, truncateText, extractRepoName */
/* harmony import */var _anysphere_proto_aiserver_v1_background_composer_pb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("../proto/dist/generated/aiserver/v1/background_composer_pb.js");
const formatTimestamp = timestampMs => {
  const date = new Date(timestampMs);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffDays > 0) {
    return `${diffDays}d`;
  } else if (diffHours > 0) {
    return `${diffHours}h`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes}m`;
  } else {
    return "now";
  }
};
const getTimeCategory = timestampMs => {
  const date = new Date(timestampMs);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 24) {
    return "Today";
  } else if (diffHours < 168) {
    // 7 days
    return "This Week";
  } else {
    return "Older";
  }
};
const getStatusIcon = status => {
  switch (status) {
    case BackgroundComposerStatus.RUNNING:
      return "●";
    case BackgroundComposerStatus.FINISHED:
      return "✓";
    case BackgroundComposerStatus.ERROR:
      return "✗";
    case BackgroundComposerStatus.CREATING:
      return "○";
    case BackgroundComposerStatus.EXPIRED:
      return "◉";
    default:
      return "?";
  }
};
const getStatusColor = status => {
  switch (status) {
    case BackgroundComposerStatus.RUNNING:
      return "blue";
    case BackgroundComposerStatus.FINISHED:
      return "green";
    case BackgroundComposerStatus.ERROR:
      return "red";
    case BackgroundComposerStatus.CREATING:
      return "yellow";
    case BackgroundComposerStatus.EXPIRED:
      return "gray";
    default:
      return "gray";
  }
};
const getSourceText = source => {
  switch (source) {
    case BackgroundComposerSource.EDITOR:
      return "editor";
    case BackgroundComposerSource.SLACK:
      return "slack";
    case BackgroundComposerSource.WEBSITE:
      return "website";
    case BackgroundComposerSource.LINEAR:
      return "linear";
    default:
      return "unknown";
  }
};
const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
};
const extractRepoName = repoUrl => {
  return repoUrl ? repoUrl.split("/").pop() || repoUrl : "unknown";
};

/***/