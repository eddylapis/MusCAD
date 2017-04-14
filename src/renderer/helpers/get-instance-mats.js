export default function getInstanceMats(definition) {
  let refs = definition._references;
  return refs.map(r => r.absTrans);
}
