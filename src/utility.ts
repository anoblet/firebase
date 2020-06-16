export const mapSnapshotToArray = (snapshot: any) => {
  const result: any = [];
  snapshot.forEach((doc: any) => {
    const data = doc.data();
    data.id = doc.id;
    result.push(data);
  });
  return result;
};
