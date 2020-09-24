exports.formatErrorMsg = (constraint) => {
  const desiredWord = constraint.split('_')[1];
  const msgDetail =
    desiredWord.substring(0, 1).toUpperCase() + desiredWord.substring(1);
  return msgDetail;
};
