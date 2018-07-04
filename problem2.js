$(
	function()  {
		$(".spin").on("click", function() {
			if (Math.floor(Math.random() * 2)) {
			    // playSpin (hash, won amount, bet amount, player id
				playSpin("kDozJe2PAv5AZ4Uc", 1500, 1500, 1);
			} else {
				playSpin("kDozJe2PAv5AZ4Uc", -500, 500, 1);
			}
		});
	}
);

// playSpin function calls a separate php file that handles the call to the config where the data is validated and updated as necessary
function playSpin(hash, won, bet, id) {
    $.ajax({
        type:'POST',
        url:'problem2-spin.php',
		data: { hash: hash, won: won, bet: bet, id: id },
		dataType: 'json',
        success:function(data){
			alert("Success!" +
			      "\nPlayer: " + data["name"] +
			      "\nCredits: " + data["credits"] +
			      "\nSpins: " + data["spins"] +
			      "\nAverage: " + data["average"]);
        },
        failure:function(){
			alert("Failed!");
        }
    });
}