const rows = $('tbody').children();
let rowsArray = [];
for(let i = 0; i < rows.length; i++){
    rowsArray.push(rows[i]);
}
let items = [];
rowsArray.forEach(element => {
    const rowDetails = {
        name: element.getAttribute('data-name'),
        size: parseInt(element.getAttribute('data-size')),
        time: parseInt(element.getAttribute('data-time')),
        html: element.outerHTML
    };
    items.push(rowDetails);
});

const sortStatus = {
    name:'none',
    size:'none',
    time:'none'
};

const sort = (items, target, status) => {
    items.sort((item1, item2) => {
        let value1, value2;
        if (target == 'name'){
            value1 = item1.name.toUpperCase();
            value2 = item2.name.toUpperCase();
        }
        else if(target == 'size'){
            value1 = item1.size;
            value2 = item2.size;
        }
        else{
            value1 = item1.time;
            value2 = item2.time;
        }

        if(value1 < value2){
            return -1;
        }
        if(value1 > value2){
            return 1;
        }
        return 0;
    });
    if(status === 'down')
    {
        items.reverse();
    }
};

const fillTableBody = items => {
    const content = items.map(element => element.html).join('');
    $('tbody').html(content);
}

//Event Listener
document.getElementById('HeadRow').addEventListener('click', (event) => {
    if(event.target){
        $('i').remove();
        switch (event.target.id){
            case 'name':
                if(['none', 'down'].includes(sortStatus[event.target.id])){
                    sort(items, event.target.id, 'up');
                    sortStatus[event.target.id] = 'up';
                    event.target.innerHTML += ' <i class="fas fa-arrow-alt-circle-up"></i>';
                }
                else if(sortStatus[event.target.id] === 'up'){
                    sort(items, event.target.id, 'down');
                    sortStatus[event.target.id] = 'down';
                    event.target.innerHTML += ' <i class="fas fa-arrow-alt-circle-down"></i>'
                }
                console.log(sortStatus);
                fillTableBody(items);
                break;
            case 'size':
                if(['none', 'down'].includes(sortStatus[event.target.id])){
                    sort(items, event.target.id, 'up');
                    sortStatus[event.target.id] = 'up';
                    event.target.innerHTML += ' <i class="fas fa-arrow-alt-circle-up"></i>';
                }
                else if(sortStatus[event.target.id] === 'up'){
                    sort(items, event.target.id, 'down');
                    sortStatus[event.target.id] = 'down';
                    event.target.innerHTML += ' <i class="fas fa-arrow-alt-circle-down"></i>'
                }
                console.log(sortStatus);
                fillTableBody(items);
                break;
            case 'time':
                if(['none', 'down'].includes(sortStatus[event.target.id])){
                    sort(items, event.target.id, 'up');
                    sortStatus[event.target.id] = 'up';
                    event.target.innerHTML += ' <i class="fas fa-arrow-alt-circle-up"></i>';
                }
                else if(sortStatus[event.target.id] === 'up'){
                    sort(items, event.target.id, 'down');
                    sortStatus[event.target.id] = 'down';
                    event.target.innerHTML += ' <i class="fas fa-arrow-alt-circle-down"></i>'
                }
                console.log(sortStatus);
                fillTableBody(items);
                break;
            default:
                break;
        }
    }
});