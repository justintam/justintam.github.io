<?php
	// require mysql config functions
	require("problem2-config.php");
	// don't continue if params empty
	if (!($_POST) || ($_POST["hash"] == "") || ($_POST["won"] == "" && checkInteger($_POST["won"])) || ($_POST["bet"] == "" && checkInteger($_POST["bet"])) || ($_POST["id"] == "" && checkInteger($_POST["id"]))) {
		exit;
	} else {
	    $db = new Database();
		// connect to database
		$db->connectDB();
		// initialize database
		$db->initDB();
		// validate the spin
		echo $db->validateSpin($_POST["hash"], $_POST["won"], $_POST["bet"], $_POST["id"]);
	}
	
	// checkInteger function to verify if inputs are actually integers or not, can be altered to handle decimals or commas if desired
	function checkInteger($value) {
		// regex verification
		if (!preg_match('/^\d+$/', $value)) {
			return true;
		}
		return false;
	}
?>