var deviceIP = "NULL";
fetch("https://api.ipify.org?format=json")
  .then(response => response.json())
  .then(data => {
    deviceIP = data.ip;
});
fetch(`https://api.jsonbin.io/v3/b/64da5c43b89b1e2299d0933c`,{
    method: 'GET',
    headers: {
        'X-MASTER-KEY':'$2b$10$mCWrkssvTmzzCTIPfRai/u8I1xxTSqGTztH0zF0tORQ9apnIvNQ6.'
    }
}).then(res => res.json()).then(data => {
    //console.log(data);
    data.record.forEach(element => {
        if(element.ip == deviceIP){
            //console.log("your old comment = ",element.comment);
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');
            commentDiv.textContent = `${element.comment}`;
            document.getElementById('comments').appendChild(commentDiv);
        }
    });

document.getElementById('send').addEventListener('click',() => {
    if(document.getElementById('input').value != ''){
        send(data);
    }
});
});
function send(data){
    const newdata = {
        ip: deviceIP,
        comment: document.getElementById('input').value
    };
    const records = data.record;
    records.push(newdata);

    // Flatten the nested structure of the records
    const flattenedRecords = records.map(record => ({
        ip: record.ip,
        comment: record.comment
    }));
    records.push(newdata);
    fetch(`https://api.jsonbin.io/v3/b/64da5c43b89b1e2299d0933c`,{
        method: 'PUT',
        headers: {
            'Content-Type':'application/json',
            'X-MASTER-KEY':'$2b$10$mCWrkssvTmzzCTIPfRai/u8I1xxTSqGTztH0zF0tORQ9apnIvNQ6.',
        },
        body: JSON.stringify(flattenedRecords)
    });
    document.getElementById('input').value = '';
}