

// Anonymous function to fetch data from firebase, process it and then call processData_Heatmap()
(async function () {

    let firebaseData = {};

    // fetch data from firebase
    await fetch("https://inovus-smart-door-default-rtdb.asia-southeast1.firebasedatabase.app/logs.json").then(response => response.json()
        .then(data => firebaseData = data)
        .then((firebaseData) => {

            console.log("%cFirebase data fetched successfully", "color: yellow;");
            // console.log(firebaseData);

            // object of objects to array of objects
            firebaseData = Object.keys(firebaseData).map(key => ({ ...firebaseData[key], key }));

            // sort array of objects by time
            firebaseData.sort((a, b) => (a.time > b.time) ? -1 : 1);

            
            
            let itemData = {};
            
            for(let key in firebaseData) {
                itemData = {
                    owner: firebaseData[key].owner ? firebaseData[key].owner : "Autolock System",
                    status: firebaseData[key].status == true ? "opened" : "closed",
                    date: getDateFromObject(firebaseData[key].date),
                    time: getTimeFromEpoch(firebaseData[key].time),

                    relativeTime: getRelativeTime(firebaseData[key].time),
                }

                generateDOM(itemData);
                
            }

        })
    );

})();


function getRelativeTime(time) {
    let date = moment.unix(time).format('MMMM DD YYYY hh:mm');
    return moment(date).fromNow();
    // return date;
}


function getDateFromObject(dateObject) {
    if(dateObject.dd == 1) {
        return `${dateObject.dd}st ${getMonthFromNumber(dateObject.mm)} ${dateObject.yyyy}`;
    } else if(dateObject.dd == 2) {
        return `${dateObject.dd}nd ${getMonthFromNumber(dateObject.mm)} ${dateObject.yyyy}`;
    } else if(dateObject.dd == 3) {
        return `${dateObject.dd}rd ${getMonthFromNumber(dateObject.mm)} ${dateObject.yyyy}`;
    } else {
        return `${dateObject.dd}th ${getMonthFromNumber(dateObject.mm)} ${dateObject.yyyy}`;
    }
}

function getTimeFromEpoch(epochTime) {
    let date = new Date(epochTime);
    let hours = date.getHours();
    let minutes = date.getMinutes();

    if(hours > 12) {
        hours -= 12;
    } else if(hours == 0) {
        hours = 12;
    }
    
    if(minutes == 0) {
        minutes = "00";
    } else if(minutes > 10) {
        minutes = `${minutes}`;
    }

    return `${hours}:${minutes} ${date.getHours() > 12 ? "PM" : "AM"}`;
}

function getMonthFromNumber(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
  
    return date.toLocaleString('en-US', { month: 'long' });
}






function generateDOM(data) {

    console.log(data);

    let activityItem = document.createElement("div");
    activityItem.classList.add("activity-item");

    let activityItemWrapper = document.createElement("div");
    activityItemWrapper.classList.add("activity-item-wrapper");

    let icon = document.createElement("div");
    icon.classList.add("icon");

    let svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 983 1024"><g id="icomoon-ignore"></g><path fill="#90A4AE" d="M402.773 144.51c13.225 0 24.964 8.461 29.142 21.006l175.657 526.97 73.257-219.771c4.182-12.546 15.921-21.004 29.143-21.004h136.536c16.966 0 30.72 13.754 30.72 30.72s-13.754 30.72-30.72 30.72h-114.393l-95.4 286.192c-4.178 12.546-15.917 21.008-29.143 21.008-13.222 0-24.961-8.462-29.143-21.008l-175.656-526.968-73.256 219.768c-4.182 12.546-15.921 21.008-29.144 21.008h-136.533c-16.966 0-30.72-13.754-30.72-30.72s13.754-30.72 30.72-30.72h114.391l95.398-286.195c4.182-12.544 15.921-21.006 29.143-21.006z" /></svg>`
    icon.innerHTML = svgIcon;

    let statementGroup = document.createElement("div");
    statementGroup.classList.add("statement-group");

    let statement = document.createElement("p");
    statement.classList.add("statement");
    statement.innerHTML = `<span>${data.owner}</span> has <span>${data.status}</span> the door <span>${data.relativeTime}</span> at <span>${data.time}</span>`;

    let subStatement = document.createElement("div");
    subStatement.classList.add("sub-statement");
    subStatement.innerHTML = `<span>${data.date}</span> <span>${data.time}</span>`;

    statementGroup.appendChild(statement);
    statementGroup.appendChild(subStatement);

    activityItemWrapper.appendChild(icon);
    activityItemWrapper.appendChild(statementGroup);

    activityItem.appendChild(activityItemWrapper);

    document.getElementById("activity-items-holder").appendChild(activityItem);
}
