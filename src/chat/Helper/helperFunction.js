function imran() {
  console.log("from external file");
}
function uniqueId() {
  return String(Date.now().toString(32) + Math.random().toString(16)).replace(
    /\./g,
    ""
  );
}

export { imran, uniqueId };
