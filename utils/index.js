exports.formatErrorMsg = (constraint) => {
  const commentless = constraint.replace('comments_', '');
  const foreignless = commentless.replace('_foreign', '');
  const msgDetail =
    foreignless.substring(0, 1).toUpperCase() + foreignless.substring(1);
  return msgDetail;
};
