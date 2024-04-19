// Calculate load and change values based on random generation
var Capacity = 18;    // Max capacity of lift
var fullTrigger = Capacity - Math.floor((0.25) * Capacity);
var Load=[];
for(var i=0;i<4;i++) {
    Load[i] = Generator(Capacity);
}



//Floor Generation
var max_floors= 11;
var Start=[];
for(var i=0;i<4;i++) {
    Start[i]=Generator(max_floors+1) - 1;
    $('.division2'+i).html(Start[i]);
}



// Direction Generation
var Direction = []
for(var i=0;i<4;i++) {
    Direction[i]=Generator(2);
    if(Direction[i]==1) {
        Direction[i]=-1;
    } else if(Direction[i]==2) {
        Direction[i]=1;
    }

    if(Start[i]==max_floors) {
        $('.division1' + i).html('<i class="fas fa-arrow-down fa-3x"></i>');   
    } else if(Start[i]==0) {
        $('.division1' + i).html('<i class="fas fa-arrow-up fa-3x"></i>');   
    } else if (Direction[i] == 1) {
        $('.division1' + i).html('<i class="fas fa-arrow-up fa-3x"></i>');
    } else if (Direction[i] == -1) {
        $('.division1' + i).html('<i class="fas fa-arrow-down fa-3x"></i>');
    } 
}



// Update the page
update();
setInterval(update, 3000);

function update() 
{
    for(var i=0;i<4;i++)
    {
        randomStop(i); // Check if elevator should stop
        loadDisplay(Load[i],i+1);
        floorUpdate(i);
    }
}   


function randomStop(i) {
    // Check if elevator should stop with 5% probability
    var randomStop = Generator(100); 
    if (randomStop <= 30) {
        // Determine number of people getting off and on
        var off = Generator(Load[i]);
        var on = Generator(Capacity - Load[i]);
        // alert("Hello " + (i+1) + " Load: " + Load[i] + " Load off: " + off + " Load on: " + on);
        
        // Update load
        Load[i] -= off;
        Load[i] += on;
    }
}

function loadDisplay(Load,i) {
    // Display load icons based on load
    if (Load < fullTrigger) {
        $('.person-A' + i).addClass('lift-Empty').removeClass('lift-Full lift-Overweight');
        $('.person-B' + i).removeClass('lift-Full lift-Overweight');
        $('.person-C' + i).removeClass('lift-Overweight');
    } else if (fullTrigger <= Load && Load < Capacity) {
        $('.person-A' + i).addClass('lift-Full').removeClass('lift-Empty lift-Overweight');
        $('.person-B' + i).addClass('lift-Full').removeClass('lift-Overweight');
        $('.person-C' + i).removeClass('lift-Overweight');
    } else if (Load == Capacity) {
        $('.person-A' + i).addClass('lift-Overweight').removeClass('lift-Empty lift-Full');
        $('.person-B' + i).addClass('lift-Overweight').removeClass('lift-Full');
        $('.person-C' + i).addClass('lift-Overweight');
    }
}

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


//Random number generator
function Generator(Max_Val) {
    return Math.floor(Math.random() * Max_Val) + 1;
}
