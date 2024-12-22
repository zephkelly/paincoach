import require$$1 from 'crypto';

function getEmailHash(email) {
  return require$$1.createHash("md5").update(email.toLowerCase()).digest("hex");
}

export { getEmailHash as g };
//# sourceMappingURL=emailHash.mjs.map
