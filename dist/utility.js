export const mapSnapshotToArray = (snapshot) => {
    const result = [];
    snapshot.forEach((doc) => {
        const data = doc.data();
        data.id = doc.id;
        result.push(data);
    });
    return result;
};
