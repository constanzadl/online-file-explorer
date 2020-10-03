

const filesize = 10995116277760;
const units = "BKMGT";
const index = Math.floor(Math.log10(filesize)/3);
const filesizeHuman = Math.floor(filesize/Math.pow(1000,index));
console.log(`${filesizeHuman}${units[index]}`);
