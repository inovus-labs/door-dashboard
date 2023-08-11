

// Anonymous function to fetch data from firebase, process it and then call generateDOM() function to generate DOM elements
(async function () {

    let firebaseData = {};

    // fetch data from firebase
    await fetch("https://inovus-smart-door-default-rtdb.asia-southeast1.firebasedatabase.app/logs.json").then(response => response.json()
        .then(data => firebaseData = data)
        .then((firebaseData) => {

            console.log("%cFirebase data fetched successfully", "color: yellow;");
            // console.log(firebaseData);

            // convert firebase object to array
            firebaseData = Object.keys(firebaseData).map(key => ({ ...firebaseData[key], key }));

            // sort array in descending order
            firebaseData.sort((a, b) => (a.time > b.time) ? -1 : 1);
            
            let itemData = {};
            
            // process data and generate DOM elements
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



// function to get relative time from epoch time using moment.js
function getRelativeTime(time) {
    let date = moment.unix(time).format('MMMM DD YYYY hh:mm');
    return moment(date).fromNow();
}



// function to get date from date object with format: 1st January 2021
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



// function to get time from epoch time with format: 12:00 AM
// Also converts 24 hour time to 12 hour time with AM/PM
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



// function to get month name from month number
function getMonthFromNumber(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
  
    return date.toLocaleString('en-US', { month: 'long' });
}



// function to generate DOM elements
function generateDOM(data) {

    console.log(data);

    // <div class="activity-item">
    let activityItem = document.createElement("div");
    activityItem.classList.add("activity-item");

    // <div class="activity-item-wrapper">
    let activityItemWrapper = document.createElement("div");
    activityItemWrapper.classList.add("activity-item-wrapper");

    // <div class="icon">
    let icon = document.createElement("div");
    icon.classList.add("icon");

    // <svg>...</svg>
    let svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 983 1024"><g id="icomoon-ignore"></g><path fill="#90A4AE" d="M402.773 144.51c13.225 0 24.964 8.461 29.142 21.006l175.657 526.97 73.257-219.771c4.182-12.546 15.921-21.004 29.143-21.004h136.536c16.966 0 30.72 13.754 30.72 30.72s-13.754 30.72-30.72 30.72h-114.393l-95.4 286.192c-4.178 12.546-15.917 21.008-29.143 21.008-13.222 0-24.961-8.462-29.143-21.008l-175.656-526.968-73.256 219.768c-4.182 12.546-15.921 21.008-29.144 21.008h-136.533c-16.966 0-30.72-13.754-30.72-30.72s13.754-30.72 30.72-30.72h114.391l95.398-286.195c4.182-12.544 15.921-21.006 29.143-21.006z" /></svg>`
    icon.innerHTML = svgIcon;

    // <div class="statement-group">
    let statementGroup = document.createElement("div");
    statementGroup.classList.add("statement-group");

    // <p class="statement">...</p>
    let statement = document.createElement("p");
    statement.classList.add("statement");
    statement.innerHTML = `<span>${data.owner}</span> has <span>${data.status}</span> the door <span>${data.relativeTime}</span>.`;

    // <div class="sub-statement">...</div>
    let subStatement = document.createElement("div");
    subStatement.classList.add("sub-statement");
    subStatement.innerHTML = `<span>${data.date}</span> <span>${data.time}</span>`;

    // append all elements
    statementGroup.appendChild(statement);
    statementGroup.appendChild(subStatement);

    activityItemWrapper.appendChild(icon);
    activityItemWrapper.appendChild(statementGroup);

    activityItem.appendChild(activityItemWrapper);

    // append to DOM
    document.getElementById("activity-items-holder").appendChild(activityItem);
}
