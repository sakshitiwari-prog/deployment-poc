async function asyncFunc() {
  const data = await promiseFs.readFile("./Stream/input.txt", "utf8");
  await promiseFs.writeFile("./Stream/output.txt", data);
}
