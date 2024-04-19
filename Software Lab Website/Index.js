// Sleep Function

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize audio
let floorDing = new Audio('Audio/Floor_ding.wav');
let finalDing = new Audio('Audio/Destination_ding.mp3');
let doors=new Audio('Audio/20131106_elevator-door-closing_zoomh6xy-87444.mp3');

// Start Animation
$('.btn-success').on('click', function initialLoad(){
  $('.left-half').addClass('left-half-entry');
  $('.right-half').addClass('right-half-entry');


  function playdoors() {
    let clone = doors.cloneNode(true); // Clone the audio element
    clone.play();
}

  function playFloorDing() {
    let clone = floorDing.cloneNode(true); // Clone the audio element
    clone.play();
}

function playFinalDing() {
    let clone = finalDing.cloneNode(true); // Clone the audio element
    clone.play();
}

// Function to start audio playback when user interacts with the document

    playdoors();
    // Schedule subsequent actions
    sleep(6000).then(playFloorDing);
    sleep(8000).then(playFloorDing);
    sleep(10000).then(playFloorDing);
    sleep(12000).then(playFinalDing);
    sleep(14000).then(() => {
        playdoors();
        $('.left-half').addClass('left-half-exit');
        $('.right-half').addClass('right-half-exit');
        $('.load-data').css('opacity','1');     //Edit CSS
        $('.loader').css('opacity','1');
    });

    sleep(18000).then(()=>{
      $('body').css('overflow','auto');       //Auto add scroll bar again
    })
    
    document.removeEventListener("click",initialLoad);    //Stop animation from replaying
    sleep(7000).then(()=> {               //Remove lobby and bring loader to front
      $('img').remove();
      $('h1').remove();});      

    sleep(18500).then(()=>{
      window.open("HomePage/Home.html","_top","replace:false");       //Auto redirect to home page
    })
});

