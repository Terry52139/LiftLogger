// Calculate load and change values based on random generation
var Capacity = 18;    // Max capacity of lift
var fullTrigger = Capacity - Math.floor((0.25) * Capacity);
var Load = [];
for (var i = 0; i < 4; i++) {
    Load[i] = Generator(Capacity);
}

// Floor Generation
var max_floors = 11;
var Start = [];
for (var i = 0; i < 4; i++) {
    Start[i] = Generator(max_floors + 1) - 1;
    $('.division2' + i).html(Start[i]);
}

// Direction Generation
var Direction = [];
for (var i = 0; i < 4; i++) {
    Direction[i] = Generator(2);
    if (Direction[i] === 1) {
        Direction[i] = -1;
    } else if (Direction[i] === 2) {
        Direction[i] = 1;
    }

    if (Start[i] === max_floors) {
        $('.division1' + i).html('<i class="fas fa-arrow-down fa-3x"></i>');
    } else if (Start[i] === 0) {
        $('.division1' + i).html('<i class="fas fa-arrow-up fa-3x"></i>');
    } else if (Direction[i] === 1) {
        $('.division1' + i).html('<i class="fas fa-arrow-up fa-3x"></i>');
    } else if (Direction[i] === -1) {
        $('.division1' + i).html('<i class="fas fa-arrow-down fa-3x"></i>');
    }
}

// Prompt user for floor
var userFloor = prompt("Enter Floor");
var timeLeft = []; // Initialize timeLeft array

// Initialize timeLeft for each panel
for (var i = 0; i < 4; i++) {
    timeLeft[i] = 0;
}

// Update the page
update();
updateinter();
setInterval(updateinter, 1000);
setInterval(update, 3000);




//ML Function
var ML = []; 

$('#butt').click(() => {
    $(".Time-popup").addClass("open-popup");
    $(".list-group-item").css({"pointer-events":"none"});
    $(".Time-button-less, .Time-button-more").one("click", function(){
        $(".Time-popup").removeClass("open-popup");
        $(".list-group-item").css({"pointer-events":""});
        const value = $(this).hasClass("Time-button-less") ? 'L' : 'M';
        MLUpdate(value);
        // Unbind click event handlers for both buttons
        $(".Time-button-less, .Time-button-more").off("click");
    });
});

var speed=6.08;stddev=4.988;
var flag=0;

function MLUpdate(value)
{
    ML.push(value);
    if(value=='M')
    {
        speed+=stddev;
    }
    else if(value=='L')
    {
        speed-=stddev;
    }
    if(ML.length==10)
    {
        for(var i=1;i<10;i++)
        {
            if(ML[i-1]==ML[i])
            {
                flag=1;
            }
        }

        if(flag==0)
        {
            stddev=stddev/2;
            console.log(stddev);
            ML=[];
        }
        else
        {
            flag=0;
            console.log(stddev);
            ML=[];
        }
    }
}






// Function to calculate time left based on elevator's position and direction
function TimeLeft(i) {
    if (userFloor >= Start[i]) {
        if (Direction[i] === 1) {
            timeLeft[i] = Math.abs(userFloor - Start[i]) * 3;
        } else if (Direction[i] === -1) {
            timeLeft[i] = (Math.abs(0 - Start[i])) * 3 + (Math.abs(0 - userFloor)) * 3;
        }
    } else if (userFloor <= Start[i]) {
        if (Direction[i] === 1) {
            timeLeft[i] = (Math.abs(max_floors - Start[i])) * 3 + (Math.abs(max_floors - userFloor)) * 3;
        } else if (Direction[i] === -1 && userFloor === Start[i]) {
            timeLeft[i] = (Math.abs(0 - Start[i])) * 3 + (Math.abs(0 - userFloor)) * 3;
        } else {
            timeLeft[i] = Math.abs(userFloor - Start[i]) * 3;
        }
    }
}

// Function to continuously update timeLeft
function updateinter() {
    for (var i = 0; i < 4; i++) {
        updateEnd(i);
    }
}

function updateEnd(i) {
    if (userFloor === Start[i]) {
        TimeLeft(i);
    }
    $('.division3' + i).html(timeLeft[i]);
    timeLeft[i]--;
    if (timeLeft[i] < 0) {
        TimeLeft(i); // Recalculate timeLeft if it goes negative
    }
}

// Function to update elevator status
function update() {
    for (var i = 0; i < 4; i++) {
        randomStop(i); // Check if elevator should stop
        loadDisplay(Load[i], i + 1);
        floorUpdate(i);
    }
}

// Function to randomly stop elevator
function randomStop(i) {
    // Check if elevator should stop with 30% probability
    var randomStop = Generator(100);
    if (randomStop <= 30) {
        // Determine number of people getting off and on
        var off = Generator(Load[i]);
        var on = Generator(Capacity - Load[i]);

        // Update load
        Load[i] -= off;
        Load[i] += on;
    }
}

// Function to display load icons based on load
function loadDisplay(Load, i) {
    // Display load icons based on load
    if (Load < fullTrigger) {
        $('.person-A' + i).addClass('lift-Empty').removeClass('lift-Full lift-Overweight');
        $('.person-B' + i).removeClass('lift-Full lift-Overweight');
        $('.person-C' + i).removeClass('lift-Overweight');
    } else if (fullTrigger <= Load && Load < Capacity) {
        $('.person-A' + i).addClass('lift-Full').removeClass('lift-Empty lift-Overweight');
        $('.person-B' + i).addClass('lift-Full').removeClass('lift-Overweight');
        $('.person-C' + i).removeClass('lift-Overweight');
    } else if (Load === Capacity) {
        $('.person-A' + i).addClass('lift-Overweight').removeClass('lift-Empty lift-Full');
        $('.person-B' + i).addClass('lift-Overweight').removeClass('lift-Full');
        $('.person-C' + i).addClass('lift-Overweight');
    }
}

// Function to update elevator's current floor and direction
function floorUpdate(i) {
    var currentFloor = Start[i]; // Get the current floor number

    // Update the floor number based on the direction
    currentFloor += Direction[i];

    // Ensure the floor number stays within valid range
    currentFloor = Math.max(0, Math.min(max_floors, currentFloor));

    Start[i] = currentFloor; // Update the Start array with the new floor number

    if (currentFloor === max_floors) {
        Direction[i] = -1; // If at top floor, set direction downward
        $('.division1' + i).html('<i class="fas fa-arrow-down fa-3x"></i>');
        Load[i] = Generator(Capacity);
        loadDisplay(Load[i], i + 1);
    } else if (currentFloor === 0) {
        Direction[i] = 1; // If at bottom floor, set direction upward
        $('.division1' + i).html('<i class="fas fa-arrow-up fa-3x"></i>');
        Load[i] = Generator(Capacity);
        loadDisplay(Load[i], i + 1);
    }

    $('.division2' + i).html(currentFloor); // Update the HTML content with the new floor number
}

// Random number generator
function Generator(Max_Val) {
    return Math.floor(Math.random() * Max_Val) + 1;
}
