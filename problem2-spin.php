<?php
	// require mysql config functions
	require("problem2-config.php");
	echo "ok";
	// don't continue if params empty
	if (!($_POST) || ($_POST["hash"] == "") || ($_POST["won"] == "") || ($_POST["bet"] == "") || ($_POST["id"] == "")) {
		exit;
	} else {
		// connect to database
		connectDB();
		// initialize database
		initDB();
		// validate the spin
		echo validateSpin($_POST["hash"], $_POST["won"], $_POST["bet"], $_POST["id"]);
	}
?>