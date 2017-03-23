export default function getInstanceMats(definition) {
  let arrMats = [];
  let refs = definition.references;
  for (let rid in refs) {
    let ref = refs[rid];
    arrMats.push(ref.absTrans);
  }
  return arrMats;
}
