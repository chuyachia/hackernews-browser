export const safeGet = (path, object, defaultValue) => {
  const rtn = path.reduce((acc, cur) => acc && acc[cur] ? acc[cur] : undefined, object);
  
  return rtn === undefined ? defaultValue : rtn;
}
