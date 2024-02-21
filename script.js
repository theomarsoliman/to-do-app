const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
    if (inputBox.value === '') {
        alert("You must write something!");
        return;
    }

    // Check for duplicates
    let isDuplicate = false;
    const listItems = listContainer.getElementsByTagName("li");
    for (let item of listItems) {
        if (item.textContent.slice(0, -1) === inputBox.value) { // slice to remove the '×' character
            isDuplicate = true;
            break;
        }
    }

    if (isDuplicate) {
        showDuplicatePopup(); // Show the custom popup instead of alert
        inputBox.value = '';
        return;
    }

    let li = document.createElement("li");
    li.innerHTML = inputBox.value;

    // Inserting the new task in the correct position
    let firstCompletedTask = listContainer.querySelector('.checked');
    if (firstCompletedTask) {
        listContainer.insertBefore(li, firstCompletedTask);
    } else {
        listContainer.appendChild(li);
    }

    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    inputBox.value = '';
    saveData();
}

inputBox.addEventListener("keyup", function(pressenter) {
    if (pressenter.key === "Enter") {
        addTask();
        saveData();
    }
});

listContainer.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        if (e.target.classList.contains("checked")) {
            listContainer.appendChild(e.target);
        }
        checkCompletedTasks();
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        checkCompletedTasks();
        saveData();
    }
}, false);

let celebratedThreeTasks = false;


function checkCompletedTasks() {
    const checkedItems = listContainer.getElementsByClassName("checked").length;
    if (checkedItems === 3 && !celebratedThreeTasks) {
        showPopup();
        triggerConfetti();
        celebratedThreeTasks = true;
    } else if (checkedItems < 3) {
        celebratedThreeTasks = false;
    }
    }

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
};

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
}

function showDuplicatePopup() {
    const popup = document.getElementById("duplicate-popup");
    popup.style.display = "block"; // Show the popup
    setTimeout(function() {
        popup.style.display = "none"; // Hide the popup after 5 seconds
    }, 5000);
}


function showPopup() {
    const popup = document.getElementById("popup");
    popup.className = 'popup positive-popup';
    popup.style.display = "block"; // Show the popup
    popup.textContent = "Well done, 3 tasks completed";
    setTimeout(function() {
        popup.style.display = "none"; // Hide the popup after 5 seconds
    }, 5000);
}

window.onload = function() {
    showTask();
    // Add any additional initialization code here if necessary
};

function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 200,
        origin: { y: 0.6 }
    });
}

function createEvent(auth) {
    const calendar = google.calendar({version: 'v3', auth});
    let event = {
      'summary': 'Todo List Item',
      'description': 'A task that I need to do',
      'start': {
        'dateTime': '2024-01-15T09:00:00-07:00',
        'timeZone': 'America/Los_Angeles'
      },
      'end': {
        'dateTime': '2024-01-15T17:00:00-07:00',
        'timeZone': 'America/Los_Angeles'
      },
    };
  
    calendar.events.insert({
      auth: auth,
      calendarId: 'primary',
      resource: event,
    }, function(err, event) {
      if (err) {
        console.log('There was an error contacting the Calendar service: ' + err);
        return;
      }
      console.log('Event created: %s', event.htmlLink);
    });
  }
  


showTask();

